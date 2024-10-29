"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FaStar } from 'react-icons/fa';


const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`card ${className}`}>{children}</div>
}

interface CryptoData {
  symbol: string;
  timestamp: number;
  bid: number | null;
  ask: number | null;
  spot: number | null;
  change: number | null;
}

const assets = [
  "BTC", "ETH", "LTC", "XRP", "BCH",  "XLM",
  "DOGE", "LINK", "UNI", "COMP", "AAVE", 
  "SUSHI", "SNX", "CRV", "DOT", "YFI", "MKR", "PAXG", "ADA", "BAT", "ENJ",
  "AXS", "DASH", "EOS", "BAL", "KNC", "ZRX", "SAND", "GRT", "QNT", "ETC",
 "1INCH", "CHZ", "CHR", "SUPER", "ELF", "FTM", "MANA",
  "SOL", "ALGO", "LUNC", "ZEC", "XTZ", "AMP", "REN", "UMA", "SHIB",
  "LRC", "ANKR", "HBAR", "EGLD", "AVAX", "ONE", "GALA", "ALICE", "ATOM",
  "DYDX", "CELO", "STORJ", "SKL", "CTSI", "BAND", "ENS",  "MASK",
  "APE"
];

const CryptoApp = () => {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>(
    assets.map(asset => ({
      symbol: `${asset}CAD`,
      timestamp: 0,
      bid: null,
      ask: null,
      spot: null,
      change: null
    }))
  );

  useEffect(() => {
    // Creates a new WebSocket connection to the server running on localhost at port 8080
    const socket = new WebSocket('ws://localhost:8080');

    // Event listener for when the socket connection is opened
    socket.onopen = () => {
      // Sends a subscribe event to the server with the channel set to rates
      socket.send(JSON.stringify({ event: 'subscribe', channel: 'rates' }));
    };

    // Event listener for when a message is received from the server
    socket.onmessage = (event) => {
      try {
        // Parses the message string as a JSON object
        const data = JSON.parse(event.data);
        // If the message is an array and the first element has data, then update the crypto data (data is an array)
        if (data[0] && data[0].data) {
          updateCryptoData(data[0].data);
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Event listener for when an error occurs with the WebSocket connection
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Event listener for when the WebSocket connection is closed
    socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    // Cleanup function to close the WebSocket connection when the component unmounts
    // This is important to prevent memory leaks and ensure resources are properly released
    return () => {
      socket.close();
    };
  }, []);

  const updateCryptoData = (newData: CryptoData) => {
    setCryptoList(prevList =>  // Using state updater function
      prevList.map(item =>   // Map over each item in the list
        // If symbols match, update the item, otherwise keep it unchanged
        item.symbol === newData.symbol ? { ...item, ...newData } : item
        )
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1b25] text-white px-8">
      {/* Header */}
      <header className="flex justify-between items-center py-8">
        <div className="text-[#00ffb9] text-2xl font-bold">Newton</div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white">LOG IN</button>
          <button className="bg-[#00ffb9] text-black px-4 py-2 rounded-full hover:bg-[#00dfaa]">
            SIGN UP
          </button>

        </div>
      </header>
      
      <div className="px-64">
        {/* Welcome Section and Top Coins */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to Newton!</h1>
            <p className="text-gray-400 mb-4">Crypto for Canadians</p>
            <button className="bg-[#00ffb9] text-black px-8 py-3 rounded-full hover:bg-[#00dfaa] font-bold">
              SIGN UP
            </button>
          </div>

          {/* Top Coins */}
          <div className="flex gap-4">
            {['BTC', 'ETH', 'SOL'].map((symbol) => {
              const coin = cryptoList.find(c => c.symbol.startsWith(symbol));
              return (
                <Card key={symbol} className="bg-[#252732] p-4 rounded-lg w-28">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 mb-2"></div>
                    <span className="font-bold mb-1">{symbol}</span>
                    <span className={`text-sm ${
                      coin?.change && coin.change > 0 ? 'text-[#00ffb9]' : 'text-red-500'
                    }`}>
                      {coin?.change !== null ? `${coin.change.toFixed(2)}%` : '-'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search coin"
            className="w-full bg-[#252732] border-none rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400"
          />
        </div>

        {/* USD Toggle */}
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <span>Display USD pricing</span>
          <div className="w-12 h-6 bg-[#252732] rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-gray-400 rounded-full absolute left-1 top-1"></div>
          </div>
        </div>

        {/* Crypto Table */}
        <div className="overflow-x-auto" style={{ backgroundColor: '#1a1b25' }}>
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr className="text-gray-400 text-left" style={{ backgroundColor: 'transparent' }}>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>Coin</th>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>24h change</th>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>Live price</th>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>Sell price</th>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>Buy price</th>
                <th className="pb-4 font-normal" style={{ border: 'none', borderBottom: '1px solid #2d2d3d' }}>Watch</th>
              </tr>
            </thead>
            <tbody>
              {cryptoList.map((crypto, index) => (
                <tr 
                  key={crypto.symbol} 
                  style={{ 
                    backgroundColor: '#1a1b25', 
                    borderBottom: index === cryptoList.length - 1 ? 'none' : '1px solid #2d2d3d'
                  }}
                >
                  <td className="py-4" style={{ border: 'none' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500"></div>
                      <div>
                        <div className="font-bold">{crypto.symbol.split('_')[0]}</div>
                        <div className="text-gray-400 text-sm">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`${
                    crypto.change && crypto.change > 0 ? 'text-[#00ffb9]' : 'text-red-500'
                  }`} style={{ border: 'none' }}>
                    {crypto.change !== null ? `${crypto.change.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td style={{ border: 'none' }}>{crypto.spot !== null ? `$${crypto.spot.toFixed(2)}` : 'N/A'}</td>
                  <td style={{ border: 'none' }}>{crypto.bid !== null ? `$${crypto.bid.toFixed(2)}` : 'N/A'}</td>
                  <td style={{ border: 'none' }}>{crypto.ask !== null ? `$${crypto.ask.toFixed(2)}` : 'N/A'}</td>
                  <td style={{ border: 'none' }}>
                    <button className="text-gray-400 hover:text-white">
                      <FaStar className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CryptoApp;
