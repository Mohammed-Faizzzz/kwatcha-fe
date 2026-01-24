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
        const res = await fetch('https://kwatcha-api.onrender.com/stocks');
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
    <main className="min-h-screen pb-24">
      <header className="px-6 py-10 max-w-2xl mx-auto flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight">Market</h1>
          <p className="text-slate-400 text-sm font-medium">Malawi Stock Exchange Overview</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Live Market</span>
          </div>
          <p className="text-[10px] text-slate-300 font-bold tracking-widest">{marketData?.last_updated}</p>
        </div>
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
          data={marketData.stocks[selectedTicker]}
          onClose={() => setSelectedTicker(null)} 
        />
      )}

      <Navbar />
    </main>
  );
}