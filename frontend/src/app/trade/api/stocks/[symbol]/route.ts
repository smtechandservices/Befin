import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;

    try {
        const result = await yahooFinance.quote(symbol);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error(`Error fetching quote for ${symbol}:`, error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
