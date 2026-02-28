import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password, referral_code, avatar_type } = body;

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const res = await fetch('http://localhost:8000/api/users/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, referral_code, avatar_type })
        });

        let data = await res.json();
        if (!res.ok) {
            // Flatten Django errors nicely
            const errorMsg = Object.values(data).flat().join(' ') || 'Registration failed';
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        // Log the user in to get the JWT token
        const loginRes = await fetch('http://localhost:8000/api/users/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginRes.json();
        if (loginRes.ok) {
            await setSessionCookie(loginData.access);
        }

        return NextResponse.json({ user: data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
