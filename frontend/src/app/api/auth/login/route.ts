import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
        }

        const res = await fetch('http://localhost:8000/api/users/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Safe JSON parsing
        let data;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await res.json();
        } else {
            const text = await res.text();
            console.error('Non-JSON response from backend:', text.slice(0, 500));
            return NextResponse.json({
                error: 'Backend returned an unexpected response format. Please check server logs.'
            }, { status: 502 });
        }

        if (!res.ok) {
            return NextResponse.json({ error: data.detail || 'Invalid credentials' }, { status: res.status });
        }

        // Store standard Django JWT access token in cookie
        await setSessionCookie(data.access);

        // Fetch user profile using the token
        const profileRes = await fetch('http://localhost:8000/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const user = await profileRes.json();

        return NextResponse.json({
            user,
            access: data.access,
            refresh: data.refresh
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
