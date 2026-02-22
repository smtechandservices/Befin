import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const token = await getSession();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const res = await fetch('http://localhost:8000/api/wallet/transactions/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Could not fetch transactions' }, { status: 404 });
        }

        const transactions = await res.json();
        return NextResponse.json({ transactions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
