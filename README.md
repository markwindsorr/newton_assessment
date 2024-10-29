# Newton Tech Assessment

Submitted by: Mark Windsor

Here's a preview of the frontend interface:

![Frontend Preview](frontend.png)

This project consists of a Next.js application that consumes real-time market data from a WebSocket server. Im using my favourite package ccxt to stream market data.

Further considersations to implement: search, side bar buttons and switching between cad and usd values

## Folder Structure

- `newton-assessment-app/`: Next.js app to display the table of cryptos
- `websocket-server/`: Node.js server that streams market data via WebSockets


## Installation and Running the Application

### Step 1: Install Dependencies

First, you need to install the dependencies for both the Next.js app and the WebSocket server.

```bash
cd newton-assessment-app
npm install
```

```bash
cd websocket-server
npm install
```

### Step 2: Start the WebSocket Server

Start the WebSocket server to begin streaming market data:

```bash
cd websocket-server
node index.js
```

### Step 3: Start the Next.js App

Start the Next.js app to consume market data and watch it update the table in real time

```bash
cd newton-assessment-app
npm run dev
```
