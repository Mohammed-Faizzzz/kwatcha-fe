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
      className="min-h-screen bg-t-bg text-t-fg"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, var(--t-grad1) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, var(--t-grad2) 0%, transparent 60%)",
      }}
    >
      <Navbar tickerItems={tickerItems} />

      {/* ── Hero ── */}
      <section className="px-4 md:px-6 pt-36 md:pt-44 pb-24 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              Msika wa Kampani
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-t-fg leading-[1.08] mb-5">
            Malawi is growing.
            <br />
            <span className="text-t-fg28 font-semibold">Invest in it.</span>
          </h1>
          <p className="text-t-fg45 text-[15px] max-w-md leading-relaxed mb-10">
            The Malawi Stock Exchange, finally in your hands.{" "}
            <span className="text-t-fg70 font-medium">Own a piece of home.</span>
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
              className="border border-t-linei bg-t-input hover:bg-t-hover text-t-fg80 font-medium px-7 rounded-xl transition-all"
            >
              Invest Now
            </Button>
          </div>
        </div>

        {/* Floating stat pills */}
        <div className="flex flex-wrap gap-3 mt-10">
          <div className="flex items-center gap-2 bg-t-card border border-t-linei rounded-full px-4 py-1.5">
            <span className="text-t-fg28 text-[11px]">Listed</span>
            <span className="text-t-fg70 text-[11px] font-medium">
              {stocks ? `${Object.keys(stocks).length} companies` : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-t-card border border-t-linei rounded-full px-4 py-1.5">
            <span className="text-t-fg28 text-[11px]">Currency</span>
            <span className="text-t-fg70 text-[11px] font-medium">MWK</span>
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
            24 Hr Market Snapshot
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Market Status + Breadth */}
          <div className="bg-t-card border border-t-line rounded-2xl p-6 backdrop-blur-sm">
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
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Market Breadth</p>
            <div className="flex items-end gap-3 mb-3">
              <p className="text-2xl font-bold text-t-fg">{movers?.summary.total_stocks ?? "—"}</p>
              <p className="text-t-fg30 text-xs mb-1">stocks</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-green-400/80">▲ {movers?.summary.gainers ?? "—"} up</span>
              <span className="text-red-400/70">▼ {movers?.summary.losers ?? "—"} down</span>
              <span className="text-t-fg25">— {movers?.summary.unchanged ?? "—"} flat</span>
            </div>
          </div>

          {/* Total Turnover */}
          <div className="bg-t-card border border-t-line rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <BarChart3 className="text-blue-400/60" size={20} />
            </div>
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Total Turnover</p>
            <p className="text-2xl font-bold text-t-fg">
              {movers
                ? `MK ${Number(movers.summary.total_turnover).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : "—"}
            </p>
            <p className="text-t-fg25 text-xs mt-1">
              Vol: {movers ? Number(movers.summary.total_volume).toLocaleString() : "—"} shares
            </p>
          </div>

          {/* Most Active */}
          <div className="bg-t-card border border-t-line rounded-2xl p-6 backdrop-blur-sm">
            <div className="mb-4">
              <Activity className="text-blue-400/60" size={20} />
            </div>
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-3">Most Active</p>
            <div className="space-y-3">
              {movers?.highest_volume.slice(0, 3).map((s) => (
                <div
                  key={s.ticker}
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => router.push(`/pages/${s.ticker}`)}
                >
                  <span className="text-t-fg70 text-sm font-semibold group-hover:text-t-fg transition-colors">
                    {s.ticker}
                  </span>
                  <span className="text-t-fg35 text-xs">
                    {Number(s.volume).toLocaleString()} sh
                  </span>
                </div>
              ))}
              {!movers && <p className="text-t-fg20 text-xs">Loading...</p>}
            </div>
          </div>
        </div>

        {/* ── Top Gainers & Losers ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Top Gainers */}
          <div
            className="rounded-2xl p-6 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(34,197,94,0.04) 0%, var(--t-card2) 100%)",
              border: "1px solid rgba(34,197,94,0.12)",
              boxShadow: "0 0 40px -12px rgba(34,197,94,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                  <TrendingUp size={12} className="text-green-400" />
                </div>
                <p className="text-t-fg60 text-xs uppercase tracking-widest font-bold">Top Gainers</p>
              </div>
              <button
                onClick={() => router.push("/pages/Market")}
                className="text-[10px] text-t-fg25 hover:text-t-fg50 transition-colors font-medium"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {movers?.top_gainers.slice(0, 3).map((g, i) => (
                <div
                  key={g.ticker}
                  onClick={() => router.push(`/pages/${g.ticker}`)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-green-500/[0.06] group"
                >
                  <span
                    className="text-[10px] font-black w-5 text-center shrink-0"
                    style={{
                      color: i === 0 ? "rgba(250,204,21,0.7)" : i === 1 ? "rgba(156,163,175,0.6)" : "rgba(180,120,60,0.6)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-t-fg80 group-hover:text-t-fg transition-colors leading-none">
                      {g.ticker}
                    </p>
                    {g.close != null && (
                      <p className="text-[11px] text-t-fg25 mt-0.5">
                        MK {Number(g.close).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/12 border border-green-500/20 rounded-lg px-2.5 py-1 shrink-0">
                    <span className="text-green-400 text-[11px] font-black">▲ +{g.change.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-10 rounded-xl bg-t-card animate-pulse" />
                  ))}
                </div>
              )}
              {!loading && !movers && (
                <p className="text-t-fg20 text-xs text-center py-4">No data available</p>
              )}
            </div>
          </div>

          {/* Top Losers */}
          <div
            className="rounded-2xl p-6 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.04) 0%, var(--t-card2) 100%)",
              border: "1px solid rgba(239,68,68,0.1)",
              boxShadow: "0 0 40px -12px rgba(239,68,68,0.07)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-red-500/12 border border-red-500/18 flex items-center justify-center">
                  <TrendingDown size={12} className="text-red-400" />
                </div>
                <p className="text-t-fg60 text-xs uppercase tracking-widest font-bold">Top Losers</p>
              </div>
              <button
                onClick={() => router.push("/pages/Market")}
                className="text-[10px] text-t-fg25 hover:text-t-fg50 transition-colors font-medium"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2">
              {movers?.top_losers.slice(0, 3).map((l, i) => (
                <div
                  key={l.ticker}
                  onClick={() => router.push(`/pages/${l.ticker}`)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 hover:bg-red-500/[0.06] group"
                >
                  <span
                    className="text-[10px] font-black w-5 text-center shrink-0"
                    style={{
                      color: i === 0 ? "rgba(250,204,21,0.7)" : i === 1 ? "rgba(156,163,175,0.6)" : "rgba(180,120,60,0.6)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-t-fg80 group-hover:text-t-fg transition-colors leading-none">
                      {l.ticker}
                    </p>
                    {l.close != null && (
                      <p className="text-[11px] text-t-fg25 mt-0.5">
                        MK {Number(l.close).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/18 rounded-lg px-2.5 py-1 shrink-0">
                    <span className="text-red-400 text-[11px] font-black">▼ {l.change.toFixed(2)}%</span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-10 rounded-xl bg-t-card animate-pulse" />
                  ))}
                </div>
              )}
              {!loading && !movers && (
                <p className="text-t-fg20 text-xs text-center py-4">No data available</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}