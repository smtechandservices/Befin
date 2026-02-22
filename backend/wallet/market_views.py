from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
import yfinance as yf

class MarketQuoteView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        symbol = request.query_params.get('symbol', 'RELIANCE.NS')
        try:
            ticker = yf.Ticker(symbol)
            # Use basic history fetch to get current price reliably
            hist = ticker.history(period="2d")
            
            if len(hist) < 2:
                # Fallback if only 1 day available or no previous close
                current_price = float(hist['Close'].iloc[-1]) if not hist.empty else 0
                prev_close = current_price
            else:
                current_price = float(hist['Close'].iloc[-1])
                prev_close = float(hist['Close'].iloc[-2])
                
            change = current_price - prev_close
            change_percent = (change / prev_close * 100) if prev_close else 0
            
            return Response({
                'symbol': symbol,
                'price': current_price,
                'previous_close': prev_close,
                'change': change,
                'change_percent': change_percent,
                'name': ticker.info.get('longName', symbol) if hasattr(ticker, 'info') else symbol
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class MarketHistoryView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        symbol = request.query_params.get('symbol', 'RELIANCE.NS')
        period = request.query_params.get('period', '1d')
        interval = request.query_params.get('interval', '5m')
        
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            data = []
            for index, row in hist.iterrows():
                data.append({
                    'time': str(index),
                    'open': float(row['Open']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'close': float(row['Close']),
                    'volume': int(row['Volume'])
                })
                
            return Response({'symbol': symbol, 'history': data})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
