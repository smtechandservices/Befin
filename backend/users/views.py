import random
import string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import UserSerializer, RegisterSerializer, ChangePasswordSerializer
from .models import User, ReferralCode

class ReferralCodeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        code_obj = ReferralCode.objects.filter(referrer=request.user).first()
        if not code_obj:
            return Response({"code": None})
        return Response({"code": code_obj.code})

    def post(self, request):
        # Generate a new unique 8-character code
        existing_code = ReferralCode.objects.filter(referrer=request.user).first()
        if existing_code:
            return Response({"code": existing_code.code}, status=status.HTTP_200_OK)

        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not ReferralCode.objects.filter(code=code).exists():
                break
        
        code_obj = ReferralCode.objects.create(referrer=request.user, code=code)
        return Response({"code": code_obj.code}, status=status.HTTP_201_CREATED)

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not request.user.check_password(old_password):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            request.user.set_password(new_password)
            request.user.save()
            return Response({"success": "Password updated successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
