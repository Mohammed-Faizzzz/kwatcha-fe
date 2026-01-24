// app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import StockRow from '@/components/StockRow';
import StockDetail from '@/components/StockDetail';
import { MSEApiResponse, StockData } from '@/types/market';

export default function MarketPage() {
  const [marketData, setMarketData] = useState<MSEApiResponse | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/stocks');
        const data: MSEApiResponse = await res.json();
        setMarketData(data);
      } catch (err) {
        console.error("Failed to fetch stocks. Is your backend running?", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-10 text-center font-medium">Loading MSE Market...</div>;

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Malawi Stock Exchange</h1>
        <p className="text-slate-500 text-xs">Updated: {marketData?.last_updated}</p>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-2">
        {marketData && Object.entries(marketData.stocks).map(([ticker, details]) => (
          <div 
            key={ticker} 
            onClick={() => setSelectedTicker(ticker)}
            className="cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-all active:scale-[0.98]"
          >
            <StockRow 
              symbol={ticker} 
              price={details.close} 
              change={details.change} 
              volume={details.volume}
            />
          </div>
        ))}
      </div>

      {selectedTicker && marketData && (
        <StockDetail 
          ticker={selectedTicker}
          data={marketData.stocks[selectedTicker]} // Changed 'stock=' to 'data='
          onClose={() => setSelectedTicker(null)} 
        />
      )}

      <Navbar />
    </main>
  );
}