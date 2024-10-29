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
    // Creates a new array of symbols with USDT tacked onto the end because CCXT watchTicker stream wants it in that format
    const symbols = assets.map(asset => `${asset}/USDT`);
    // Creates an array of promises that will watch tickers for each symbol
    const tickerPromises = symbols.map(symbol => watchTickerContinuously(symbol, ws));
    // Waits for all promises to resolve
    await Promise.all(tickerPromises);
}

const watchTickerContinuously = async (symbol, ws) => {

    // This is a while loop that will run indefinitely until the server is stopped
    // CCXT uses while loop to stream data
    while (true) {
        try {
            // CCXT watchTicker method is used to stream real-time market data for a specific symbol
            const ticker = await exchange.watchTicker(symbol);
            // Split the symbol with the forward slash and grab the first element since we want to display CAD values
            const asset = symbol.split('/')[0];
            // Formats the ticker data to match the expected JSON structure
            // We can also do the formatting in the frontend, but I did it here for simplicity
            // Im grabbing USDT values then multiplying them by 1.3 to get CAD values
            const formattedTicker = {
                channel: "rates",
                event: "data",
                data: {
                    symbol: `${asset}CAD`,
                    timestamp: Math.floor(Date.now() / 1000), // Conerts Javascripts millisecond timestamp to a Unix timestamp
                    bid: ticker.bid ? parseFloat((ticker.bid * 1.3).toFixed(2)) : null, // Data comes in as strings. We convert to float and use .toFixed(2) to format with 2 decimals.
                    ask: ticker.ask ? parseFloat((ticker.ask * 1.3).toFixed(2)) : null,
                    spot: ticker.last ? parseFloat((ticker.last * 1.3).toFixed(2)) : null,
                    change: ticker.percentage ? parseFloat(ticker.percentage.toFixed(2)) : null
                }
            };
            // Sends the formatted ticker data to the client
            // The array format allows for potential batch updates, so you could send multiple tickers in on update. 1 for now
            ws.send(JSON.stringify([formattedTicker]));
        } catch (e) {
            console.log(`Error watching ticker for ${symbol}:`, e);
        }
        // Waits a second before running the loop again.
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Creates a new Websocket server instance that listens for incoming connections on port 8080
const wss = new WebSocket.Server({ port: 8080 });


/**
 *  The .on() method is an event listener in Node that comes from the EventEmitter class. Its used to handle
 *  events by attaching a callback function that executes when a specified event occcurs.
 */


// Our WebSocket Server Events
// Connection event
wss.on('connection', (ws) => {
    // Logs a message notifying client has connected
    console.log('Client connected');

    // Message Event. This event is triggered when a message is received from the client.
    ws.on('message', (message) => {
        // Parses the message string as a JSON object
        const data = JSON.parse(message);
        // If the event is a subscribe event and the channel is rates, then watch the tickers
        if (data.event === 'subscribe' && data.channel === 'rates') {
            watchTickers(ws);
        }
    });
    // Close event. This event is triggered when the WebSocket connection is closed.
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');


/**
 * Other considerations. 
 * 
 * Formatting small value tokens (SHIB) Use a different .toFixed() precision
 * Rate limiting to prevent abuse (Create RateLimiter  that takes in client user ids and checks for max requests)
 * Connection limits to prevent server overload (Create a connection limiter that checks for max connections and rejects new connections if limit is reached        )
 * Heartbeat mechanism to detect dead connections (Use a heartbeat mechanism to periodically check if the client is still connected. If a client misses a heartbeat, it can be disconnected and the connection closed)
 * Message batching to reduce network traffic (Batch messages together before sending to reduce the number of packets sent over the network)
 * Error recovery (Implement error handling and recovery mechanisms to ensure the server can handle and recover from errors gracefully)
 * Load balance (Distribute incoming connections across multiple instances of the WebSocket server to distribute the load)
 * Monitoring (Implement monitoring and logging to keep track of server performance and identify issues)
 * 

 * 
 */