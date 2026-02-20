const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

async function test() {
    try {
        const result = await yahooFinance.quote('RELIANCE.NS');
        console.log('Price:', result.regularMarketPrice);
        console.log('Currency:', result.currency);
        console.log('Full Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}

test();
