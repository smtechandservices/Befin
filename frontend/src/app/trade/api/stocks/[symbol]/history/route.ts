import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '1mo';
    const interval = searchParams.get('interval') as any || '60m';

    // Calculate period1 Date based on range string
    const now = new Date();
    let period1 = new Date();
    if (range === '1d') period1.setDate(now.getDate() - 1);
    else if (range === '5d') period1.setDate(now.getDate() - 5);
    else if (range === '1mo') period1.setMonth(now.getMonth() - 1);
    else if (range === '1y') period1.setFullYear(now.getFullYear() - 1);
    else if (range === 'max') period1 = new Date('2000-01-01');

    try {
        const queryOptions: any = { period1: period1, interval: interval };
        const result: any = await yahooFinance.chart(symbol, queryOptions);

        if (result && result.quotes && result.quotes.length > 0) {
            // Filter out null values
            const validQuotes = result.quotes.filter((q: any) => q.open !== null && q.high !== null && q.low !== null && q.close !== null);

            const history = validQuotes.map((q: any) => ({
                time: q.date.toISOString(),
                open: q.open,
                high: q.high,
                low: q.low,
                close: q.close,
                volume: q.volume
            }));

            return NextResponse.json({ history });
        }

        return NextResponse.json({ history: [] });
    } catch (error: any) {
        console.error(`Error fetching history for ${symbol}:`, error);
        return NextResponse.json({ error: error.message || 'Failed to fetch historical data' }, { status: 500 });
    }
}
