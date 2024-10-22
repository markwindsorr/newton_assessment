const WebSocket = require('ws');
const ccxt = require('ccxt');

const exchange = new ccxt.pro.binance();

const assets = [
  "BTC", "ETH", "LTC", "XRP", "BCH", "USDC", "XMR", "XLM",
 "DOGE", "LINK", "MATIC", "UNI", "COMP", "AAVE", "DAI",
  "SUSHI", "SNX", "CRV", "DOT", "YFI", "MKR", "PAXG", "ADA", "BAT", "ENJ",
  "AXS", "DASH", "EOS", "BAL", "KNC", "ZRX", "SAND", "GRT", "QNT", "ETC",
  "ETHW", "1INCH", "CHZ", "CHR", "SUPER", "ELF", "OMG", "FTM", "MANA",
  "SOL", "ALGO", "LUNC", "UST", "ZEC", "XTZ", "AMP", "REN", "UMA", "SHIB",
  "LRC", "ANKR", "HBAR", "EGLD", "AVAX", "ONE", "GALA", "ALICE", "ATOM",
  "DYDX", "CELO", "STORJ", "SKL", "CTSI", "BAND", "ENS", "RNDR", "MASK",
  "APE"
];

const watchTickers = async (ws) => {
    const symbols = assets.filter(asset => asset !== 'USDT').map(asset => `${asset}/USDT`);
    const tickerPromises = symbols.map(symbol => watchTickerContinuously(symbol, ws));
    await Promise.all(tickerPromises);
}

const watchTickerContinuously = async (symbol, ws) => {

    // Im grabbing USDT values then multiplying them by 1.3 to get CAD values
    while (true) {
        try {
            const ticker = await exchange.watchTicker(symbol);
            const asset = symbol.split('/')[0];
            const formattedTicker = {
                channel: "rates",
                event: "data",
                data: {
                    symbol: `${asset}CAD`,
                    timestamp: Math.floor(Date.now() / 1000),
                    bid: ticker.bid ? parseFloat((ticker.bid * 1.3).toFixed(2)) : null,
                    ask: ticker.ask ? parseFloat((ticker.ask * 1.3).toFixed(2)) : null,
                    spot: ticker.last ? parseFloat((ticker.last * 1.3).toFixed(2)) : null,
                    change: ticker.percentage ? parseFloat(ticker.percentage.toFixed(2)) : null
                }
            };
            ws.send(JSON.stringify([formattedTicker]));
        } catch (e) {
            console.log(`Error watching ticker for ${symbol}:`, e);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.event === 'subscribe' && data.channel === 'rates') {
            watchTickers(ws);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
