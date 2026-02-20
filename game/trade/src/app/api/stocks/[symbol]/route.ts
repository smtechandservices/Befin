import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(
    request: Request,
    { params }: { params: { symbol: string } }
) {
    const symbol = params.symbol;

    try {
        const result = await yahooFinance.quote(symbol);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
