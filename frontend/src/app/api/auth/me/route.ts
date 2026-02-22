import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const token = await getSession();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profileRes = await fetch('http://localhost:8000/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!profileRes.ok) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await profileRes.json();
        return NextResponse.json({ user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
