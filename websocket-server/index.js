const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server, path: '/markets/ws' });

const assets = [
  "BTC", "ETH", "LTC", "XRP", "BCH", "USDC", "XMR", "XLM",
  "USDT", "QCAD", "DOGE", "LINK", "MATIC", "UNI", "COMP", "AAVE", "DAI",
  "SUSHI", "SNX", "CRV", "DOT", "YFI", "MKR", "PAXG", "ADA", "BAT", "ENJ",
  "AXS", "DASH", "EOS", "BAL", "KNC", "ZRX", "SAND", "GRT", "QNT", "ETC",
  "ETHW", "1INCH", "CHZ", "CHR", "SUPER", "ELF", "OMG", "FTM", "MANA",
  "SOL", "ALGO", "LUNC", "UST", "ZEC", "XTZ", "AMP", "REN", "UMA", "SHIB",
  "LRC", "ANKR", "HBAR", "EGLD", "AVAX", "ONE", "GALA", "ALICE", "ATOM",
  "DYDX", "CELO", "STORJ", "SKL", "CTSI", "BAND", "ENS", "RNDR", "MASK",
  "APE"
];

const prices = Object.fromEntries(assets.map(asset => [asset, 1000]));

const generateData = () => {
    return assets.map(asset => {
        const changePercentage = (Math.random() - 0.5) * 0.5;
        const priceChange = prices[asset] * changePercentage;
        prices[asset] = Math.max(0.01, prices[asset] + priceChange);

        const bid = prices[asset] * (0.99 + Math.random() * 0.01);
        const ask = prices[asset] * (1 + Math.random() * 0.01);

        return {
            channel: "rates",
            event: "data",
            data: {
                symbol: `${asset}_CAD`,
                timestamp: Math.floor(Date.now() / 1000),
                bid: parseFloat(bid.toFixed(2)),
                ask: parseFloat(ask.toFixed(2)),
                spot: parseFloat(prices[asset].toFixed(2)),
                change: parseFloat((changePercentage * 100).toFixed(2))
            }
        };
    });
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.event === 'subscribe' && data.channel === 'rates') {
            const interval = setInterval(() => {
                const updates = generateData();
                ws.send(JSON.stringify(updates));
            }, 1000);

            ws.on('close', () => {
                clearInterval(interval);
                console.log('Client disconnected');
            });
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on ws://localhost:${PORT}/markets/ws`);
});