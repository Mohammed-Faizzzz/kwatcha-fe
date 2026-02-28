"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, BarChart3, Building2 } from "lucide-react";
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

    fetchStocks();
    const interval = setInterval(fetchStocks, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calcMarketStatus = () => {
    const now = new Date();
    const utcOffset = 2;
    const malawiTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);
    const isWeekday = malawiTime.getDay() !== 0 && malawiTime.getDay() !== 6;
    const isMarketOpen = malawiTime.getHours() >= 9 && malawiTime.getHours() < 17;
    return isWeekday && isMarketOpen ? "Open" : "Closed";
  };

  const marketStatus = calcMarketStatus();

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
      }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="px-6 md:px-12 pt-32 pb-24 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400/70 uppercase mb-4">
            Malawi Stock Exchange
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Invest in Malawi's
            <br />
            <span className="text-white/40">Stock Market</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed mb-10">
            Track prices, analyze companies, and understand the Malawi Stock Exchange — all in one clean, modern platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => router.push("/market")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 rounded-xl gap-2 transition-all"
            >
              Explore Market <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/pages/AccountCreationPage")}
              className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-medium px-7 rounded-xl transition-all"
            >
              Open Account
            </Button>
          </div>
        </div>

        {/* Floating stat pills */}
        <div className="flex flex-wrap gap-3 mt-12">
          {[
            { label: "Exchange", value: "MSE" },
            { label: "Currency", value: "MWK" },
            { label: "Timezone", value: "UTC+2" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/[0.04] border border-white/8 rounded-full px-4 py-1.5"
            >
              <span className="text-white/30 text-xs">{label}</span>
              <span className="text-white/70 text-xs font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Market Snapshot ── */}
      <section id="market" className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/20" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400/80 px-2">
            Market Snapshot
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Market Status */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
              <TrendingUp className="text-blue-400/60" size={20} />
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  marketStatus === "Open"
                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400/80 border border-red-500/15"
                }`}
              >
                {marketStatus}
              </span>
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Market Status</p>
            <p className="text-2xl font-bold text-white">{marketStatus}</p>
            <p className="text-white/25 text-xs mt-1">Mon–Fri · 09:00–17:00 CAT</p>
          </div>

          {/* Total Turnover */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <BarChart3 className="text-blue-400/60" size={20} />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total Turnover</p>
            <p className="text-2xl font-bold text-white">MK 1.2B</p>
            <p className="text-white/25 text-xs mt-1">Latest session</p>
          </div>

          {/* Listed Companies */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <Building2 className="text-blue-400/60" size={20} />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Listed Companies</p>
            <p className="text-2xl font-bold text-white">
              {stocks ? Object.keys(stocks).length : "—"}
            </p>
            <p className="text-white/25 text-xs mt-1">Active on MSE</p>
          </div>
        </div>
      </section>

      {/* ── Companies Preview ── */}
      <section id="companies" className="px-6 md:px-12 pb-28 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
              Listed Companies
            </p>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Browse the Market
            </h2>
          </div>
          <a
            href="/market"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 animate-pulse"
              >
                <div className="h-3 w-10 bg-white/10 rounded mb-3" />
                <div className="h-5 w-32 bg-white/10 rounded mb-4" />
                <div className="h-4 w-20 bg-white/10 rounded mb-6" />
                <div className="h-3 w-16 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks &&
              Object.entries(stocks).map(([name, details]) => {
                const change = parseFloat(details.change) || 0;
                const isPositive = change >= 0;
                return (
                  <div
                    key={name}
                    className="group bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-white/[0.05] rounded-2xl p-6 transition-all cursor-pointer"
                    onClick={() => router.push(`/pages/${name}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs text-white/25 font-semibold tracking-widest uppercase">MSE</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isPositive
                            ? "bg-green-500/10 text-green-400/80 border border-green-500/15"
                            : "bg-red-500/10 text-red-400/80 border border-red-500/15"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </div>

                    <p className="text-lg font-semibold text-white mb-1 group-hover:text-blue-200 transition-colors">
                      {name}
                    </p>
                    <p className="text-2xl font-bold text-white/90 mb-4">
                      MK {Number(details.close).toLocaleString()}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-xs text-white/25">
                        <span>Vol: {Number(details.volume || 0).toLocaleString()}</span>
                      </div>
                      <span className="text-blue-400/60 text-xs group-hover:text-blue-400 transition-colors flex items-center gap-1">
                        View <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}