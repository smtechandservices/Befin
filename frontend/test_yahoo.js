const yahooFinance = require('yahoo-finance2').default;

async function run() {
    try {
        const now = new Date();
        const p1 = new Date();
        p1.setMonth(now.getMonth() - 1);

        console.log("Fetching chart for RELIANCE.NS", { period1: p1, interval: '60m' });
        const res = await yahooFinance.chart('RELIANCE.NS', { period1: p1, interval: '60m' });
        console.log("Result items:", res.quotes.length);
    } catch (err) {
        console.error("Error:", err.message);
    }
}
run();
