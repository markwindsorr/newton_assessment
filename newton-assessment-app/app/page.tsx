"use client";

import { useState, useEffect } from 'react';

interface AssetData {
  symbol: string;
  bid: number;
  ask: number;
  spot: number;
  change: number;
}

export default function AssetTable() {
  const [assetData, setAssetData] = useState<Record<string, AssetData>>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/markets/ws');

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      ws.send(JSON.stringify({ event: 'subscribe', channel: 'rates' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newAssetData: Record<string, AssetData> = {};
      data.forEach((item: any) => {
        newAssetData[item.data.symbol] = item.data;
      });
      setAssetData(prevData => ({ ...prevData, ...newAssetData }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asset Rates</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Bid</th>
            <th className="px-4 py-2">Ask</th>
            <th className="px-4 py-2">Spot</th>
            <th className="px-4 py-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(assetData).map((asset) => (
            <tr key={asset.symbol}>
              <td className="border px-4 py-2">{asset.symbol}</td>
              <td className="border px-4 py-2">{asset.bid}</td>
              <td className="border px-4 py-2">{asset.ask}</td>
              <td className="border px-4 py-2">{asset.spot}</td>
              <td className="border px-4 py-2">{asset.change}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
