"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, TrendingUp, BarChart3, TrendingDown, Activity, ChevronsLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { API_BASE } from "@/lib/constants";
import { getMarketStatus } from "@/lib/marketUtils";
import type { StockData, MarketResponse, MoversResponse } from "@/types/market";

export default function LandingPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [movers, setMovers] = useState<MoversResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [stocksData, moversData] = await Promise.all([
          apiFetch<MarketResponse>(`${API_BASE}/stocks`),
          apiFetch<MoversResponse>(`${API_BASE}/stocks/movers`),
        ]);
        setStocks(stocksData.stocks);
        setMovers(moversData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const marketStatus = getMarketStatus();

  const tickerItems = stocks
  ? Object.entries(stocks).map(([name, data]) => ({
      symbol: name,
      price: Number(data.close).toLocaleString(),
      change: parseFloat((data.pct_change * 100).toFixed(2)),
    }))
  : []

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
      }}
    >
      <Navbar tickerItems={tickerItems} />

      {/* ── Hero ── */}
      <section className="px-4 md:px-6 pt-44 pb-24 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              Msika wa Kampani
            </p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.08] mb-5">
            Malawi is growing.
            <br />
            <span className="text-white/28 font-semibold">Invest in it.</span>
          </h1>
          <p className="text-white/45 text-[15px] max-w-md leading-relaxed mb-10">
            The Malawi Stock Exchange, finally in your hands.{" "}
            <span className="text-white/70 font-medium">Own a piece of home.</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              onClick={() => router.push("pages/Market")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 rounded-xl gap-2 transition-all"
            >
              Explore Market <ArrowRight size={16} />
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/pages/AccountCreationPage")}
              className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 font-medium px-7 rounded-xl transition-all"
            >
              Invest Now
            </Button>
          </div>
        </div>

        {/* Floating stat pills */}
        <div className="flex flex-wrap gap-3 mt-10">
          <div className="flex items-center gap-2 bg-white/[0.035] border border-white/10 rounded-full px-4 py-1.5">
            <span className="w-[5px] h-[5px] rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/28 text-[11px]">Market</span>
            <span className="text-white/72 text-[11px] font-medium">{marketStatus}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.035] border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-white/28 text-[11px]">Listed</span>
            <span className="text-white/72 text-[11px] font-medium">
              {stocks ? `${Object.keys(stocks).length} companies` : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.035] border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-white/28 text-[11px]">Currency</span>
            <span className="text-white/72 text-[11px] font-medium">MWK</span>
          </div>
        </div>
      </section>

      {/* ── Market Snapshot ── */}
      <section id="market" className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/15 mb-8">
            <svg className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-400/70 text-xs leading-relaxed">{error}</p>
          </div>
        )}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/20" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400/80 px-2">
            Market Snapshot
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Market Status + Breadth */}
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
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Market Breadth</p>
            <div className="flex items-end gap-3 mb-3">
              <p className="text-2xl font-bold text-white">{movers?.summary.total_stocks ?? "—"}</p>
              <p className="text-white/30 text-xs mb-1">stocks</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400/80">▲ {movers?.summary.gainers ?? "—"} up</span>
              <span className="text-red-400/70">▼ {movers?.summary.losers ?? "—"} down</span>
              <span className="text-white/25">— {movers?.summary.unchanged ?? "—"} flat</span>
            </div>
          </div>

          {/* Total Turnover */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <BarChart3 className="text-blue-400/60" size={20} />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total Turnover</p>
            <p className="text-2xl font-bold text-white">
              {movers
                ? `MK ${Number(movers.summary.total_turnover).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : "—"}
            </p>
            <p className="text-white/25 text-xs mt-1">
              Vol: {movers ? Number(movers.summary.total_volume).toLocaleString() : "—"} shares
            </p>
          </div>

          {/* Top Movers */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <Activity className="text-blue-400/60" size={20} />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Top Movers</p>
            <div className="space-y-2">
              {movers?.top_gainers[0] && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-green-400/70" />
                    <span className="text-white/70 text-sm font-semibold">{movers.top_gainers[0].ticker}</span>
                  </div>
                  <span className="text-green-400 text-xs font-bold">
                    +{movers.top_gainers[0].change.toFixed(2)}%
                  </span>
                </div>
              )}
              {movers?.top_losers[0] && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={12} className="text-red-400/70" />
                    <span className="text-white/70 text-sm font-semibold">{movers.top_losers[0].ticker}</span>
                  </div>
                  <span className="text-red-400 text-xs font-bold">
                    {movers.top_losers[0].change.toFixed(2)}%
                  </span>
                </div>
              )}
              {!movers && <p className="text-white/20 text-xs">Loading...</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ── Companies Preview ── */}
      <section id="companies" className="px-4 md:px-6 pb-28 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
              Listed Companies
            </p>
            <h2 className="text-2xl font-bold text-white">
              Browse the Market
            </h2>
          </div>
          <button
            onClick={() => router.push("pages/Market")}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </button>
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
                const pctChange = details.pct_change * 100;
                const absChange = details.change;
                const isPositive = absChange > 0;
                const isNegative = absChange < 0;
                return (
                  <div
                    key={name}
                    className="group bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-white/[0.05] rounded-2xl p-6 transition-all cursor-pointer"
                    onClick={() => router.push(`/pages/${name}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs text-white/25 font-semibold tracking-widest uppercase">MSE</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPositive
                            ? "bg-green-500/10 text-green-400/80 border border-green-500/15"
                            : isNegative
                            ? "bg-red-500/10 text-red-400/80 border border-red-500/15"
                            : "bg-yellow-500/10 text-yellow-400/80 border border-yellow-500/15"
                        }`}
                      >
                        {!isPositive && !isNegative
                          ? <><ChevronsLeftRight size={10} /> 0.00%</>
                          : <>{isPositive ? "+" : ""}{pctChange.toFixed(2)}%</>
                        }
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
                        <span className={isPositive ? "text-green-400/60" : isNegative ? "text-red-400/60" : ""}>
                          {isPositive ? "+" : ""}{absChange.toFixed(2)} MWK
                        </span>
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