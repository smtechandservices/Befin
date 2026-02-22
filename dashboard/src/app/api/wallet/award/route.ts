import { NextResponse } from 'next/server';


// This is a public API route that is called from the games (running on ports 5173 and 3001)
// We need to support CORS for this route
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(request: Request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    try {
        const body = await request.json();
        const { userId, coins, source, game_score } = body;

        if (!body.username || coins === undefined) {
            return NextResponse.json({ error: 'Missing username or coins' }, { status: 400, headers });
        }

        const res = await fetch('http://localhost:8000/api/wallet/award/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.error || 'Server Error' }, { status: res.status, headers });
        }

        return NextResponse.json({ success: true, wallet: data.wallet }, { status: 200, headers });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500, headers });
    }
}
