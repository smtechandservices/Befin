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

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.detail || 'Invalid credentials' }, { status: 401 });
        }

        // Store standard Django JWT access token in cookie
        await setSessionCookie(data.access);

        // Fetch user profile using the token
        const profileRes = await fetch('http://localhost:8000/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const user = await profileRes.json();

        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
