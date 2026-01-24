"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, BarChart3, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { useRouter } from "next/navigation";

interface StockData {
  url: string;
  open: string;
  close: string;
  change: string;
  volume: string;
  turnover: string;
}

interface MarketResponse {
  status: string;
  market: string;
  last_updated: string;
  count: number;
  stocks: Record<string, StockData>;
}

export default function LandingPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStocks = async () => {
    try {
      const res = await fetch("https://kwatcha-api.onrender.com/stocks");
      const data: MarketResponse = await res.json();
      setStocks(data.stocks);
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  fetchStocks();

  // Refresh every 30 minutes
  const interval = setInterval(fetchStocks, 30 * 60 * 1000);

  // Cleanup on component unmount
  return () => clearInterval(interval);
  }, []);

  const calcMarketStatus = () => {
    // if 9am-5pm on weekday in Malawi Timezone, Open, else, closed
    const now = new Date();
    const utcOffset = 2; // Malawi is UTC+2
    const malawiTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);
    const isWeekday = malawiTime.getDay() !== 0 && malawiTime.getDay() !== 6; // 0 = Sunday, 6 = Saturday
    const isMarketOpen = malawiTime.getHours() >= 9 && malawiTime.getHours() < 17;

    return isWeekday && isMarketOpen ? "Open" : "Closed";
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Invest in Malawi’s Stock Market
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Track prices, analyze companies, and understand the Malawi Stock Exchange — all in one clean, modern platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Explore Market <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline">
            View Companies
          </Button>
        </div>
      </section>

      {/* Market Snapshot */}
      <section id="market" className="px-8 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Market Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <TrendingUp className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Market Status</p>
              <p className="text-xl font-semibold">{calcMarketStatus()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <BarChart3 className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Total Turnover</p>
              <p className="text-xl font-semibold">MK 1.2B</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Building2 className="mb-4 text-white/70" />
              <p className="text-sm text-white/50">Listed Companies</p>
              <p className="text-xl font-semibold">{stocks ? Object.keys(stocks).length : "-"}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Companies Preview */}
      <section id="companies" className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Listed Companies</h2>
          <a href="/market" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View all →
          </a>
        </div>

        {loading ? (
          <p className="text-white text-center py-10">Loading companies...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks &&
              Object.entries(stocks).map(([name, details]) => (
                <Card key={name} className="hover:shadow-lg transition">
                  <CardContent className="p-6">
                    <p className="text-sm text-white/50">MSE</p>
                    <p className="text-lg font-semibold mt-1 text-white">{name}</p>
                    <p className="text-sm text-white/60 mt-2">
                      MK {Number(details.close).toLocaleString()}
                    </p>
                    <Button
                      variant="link"
                      className="px-0 mt-4 text-blue-400 hover:text-blue-300"
                      onClick={() => router.push(`/pages/${name}`)}
                    >
                      View details
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
