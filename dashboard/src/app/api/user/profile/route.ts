import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        const token = await getSession();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch User and Wallet concurrently
        const [profileRes, walletRes] = await Promise.all([
            fetch('http://localhost:8000/api/users/profile/', { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch('http://localhost:8000/api/wallet/balance/', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!profileRes.ok || !walletRes.ok) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        const user = await profileRes.json();
        const wallet = await walletRes.json();

        return NextResponse.json({
            user,
            wallet,
            completedQuests: [], // Quests disabled for backend migration
            allQuests: []
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
