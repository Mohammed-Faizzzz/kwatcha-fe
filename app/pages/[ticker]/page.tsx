"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StockData {
  ticker: string;
  open?: string | number;
  close?: string | number;
  change?: string | number;
  volume?: string | number;
  yearChange?: string | number;
  week52Range?: [string | number, string | number];
  liquidity?: string | number;
  marketCap?: string | number;
  history?: { date: string; close: number }[];
  companyInfo?: {
    background?: string;
    leadership?: string[];
    financials?: string;
    news?: string[];
    insights?: string;
  };
}

export default function CompanyPage() {
  const params = useParams();
  const ticker = params?.ticker as string;

  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("background");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch("https://kwatcha-api.onrender.com/stocks");
        const data = await res.json();
        setStock(data.stocks[ticker] || null);
      } catch (err) {
        console.error(err);
        setStock(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [ticker]);

  if (loading) return <p className="text-white text-center py-10">Loading...</p>;
  if (!stock) return <p className="text-white text-center py-10">Stock not found</p>;

  // Defensive parsing
  const open = Number(stock.open ?? 0);
  const close = Number(stock.close ?? 0);
  const change = Number(stock.change ?? 0);
  const volume = Number(stock.volume ?? 0);
  const yearChange = Number(stock.yearChange ?? 0);
  const week52Range: [number, number] = [
    Number(stock.week52Range?.[0] ?? 0),
    Number(stock.week52Range?.[1] ?? 0),
  ];
  const liquidity = Number(stock.liquidity ?? 0);
  const marketCap = Number(stock.marketCap ?? 0);

  return (
    <div className="min-h-screen bg-black/90 text-white pb-24">
      <Navbar />
  <section className="px-8 pt-24 pb-12 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button variant="link" onClick={() => window.history.back()}>&larr; Back</Button>
          <h1 className="text-4xl font-bold">{ticker}</h1>
        </div>

        {/* Today & 1 Year Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent>
            <p className="text-sm text-white/50">Today's Change</p>
            <p className="text-lg font-bold">{change >= 0 ? "+" : ""}{change.toFixed(2)} / {(close - open).toFixed(2)}</p>
          </CardContent></Card>

          <Card><CardContent>
            <p className="text-sm text-white/50">Today's Volume</p>
            <p className="text-lg font-bold">{(volume / 1000).toFixed(1)}K</p>
          </CardContent></Card>

          <Card><CardContent>
            <p className="text-sm text-white/50">1 Year Change</p>
            <p className="text-lg font-bold">{yearChange.toFixed(2)}%</p>
          </CardContent></Card>

          <Card><CardContent>
            <p className="text-sm text-white/50">52 Week Range</p>
            <p className="text-lg font-bold">{week52Range[0].toLocaleString()} - {week52Range[1].toLocaleString()}</p>
          </CardContent></Card>

          <Card><CardContent>
            <p className="text-sm text-white/50">1 Year Liquidity</p>
            <p className="text-lg font-bold">MWK{(liquidity/1e6).toFixed(1)}M</p>
          </CardContent></Card>

          <Card><CardContent>
            <p className="text-sm text-white/50">Market Cap</p>
            <p className="text-lg font-bold">MWK{(marketCap/1e12).toFixed(1)}T</p>
          </CardContent></Card>
        </div>

        {/* Historic Graph */}
        <div className="bg-white/5 backdrop-blur-lg p-4 rounded-xl">
          {stock.history && stock.history.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stock.history}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke={change >= 0 ? "#00FFA3" : "#FF4C4C"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-white/50 text-center py-20">Historical data not available</p>
          )}
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex gap-4 border-b border-white/20">
          {["background","leadership","financials","news","insights"].map(tab => (
            <button
              key={tab}
              className={`pb-2 font-medium ${activeTab === tab ? "border-b-2 border-blue-500 text-white" : "text-white/60"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "background" && <p>{stock.companyInfo?.background ?? "No background info available"}</p>}
          {activeTab === "leadership" && (
            <ul className="list-disc list-inside space-y-1">
              {(stock.companyInfo?.leadership ?? ["No leadership info available"]).map((person, i) => <li key={i}>{person}</li>)}
            </ul>
          )}
          {activeTab === "financials" && <p>{stock.companyInfo?.financials ?? "No financials available"}</p>}
          {activeTab === "news" && (
            <ul className="list-disc list-inside space-y-1">
              {(stock.companyInfo?.news ?? ["No news available"]).map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          )}
          {activeTab === "insights" && <p>{stock.companyInfo?.insights ?? "No insights available"}</p>}
        </div>
      </section>
      <Footer />
    </div>
  );
}
