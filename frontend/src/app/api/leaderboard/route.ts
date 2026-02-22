import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const game = searchParams.get('game');

        const backendUrl = game
            ? `http://localhost:8000/api/wallet/leaderboard/?game=${game}`
            : 'http://localhost:8000/api/wallet/leaderboard/';

        const res = await fetch(backendUrl);
        const data = await res.json();

        return NextResponse.json({ leaderboard: data.leaderboard || [] }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
