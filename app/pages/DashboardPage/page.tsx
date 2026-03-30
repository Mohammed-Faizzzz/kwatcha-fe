"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { API_BASE } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import type { StockData } from "@/types/market";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { username: loggedInUser } = useAuth();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tickerItems = stocks
    ? Object.entries(stocks).map(([name, data]) => ({
        symbol: name,
        price: Number(data.close).toLocaleString(),
        change: parseFloat((data.pct_change * 100).toFixed(2)),
      }))
    : [];

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await apiFetch<{ stocks: Record<string, StockData> }>(
          `${API_BASE}/stocks`
        );
        setStocks(data.stocks);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load market data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const gainers = stocks
    ? Object.entries(stocks)
        .filter(([, d]) => d.pct_change > 0)
        .sort((a, b) => b[1].pct_change - a[1].pct_change)
        .slice(0, 3)
    : [];

  const losers = stocks
    ? Object.entries(stocks)
        .filter(([, d]) => d.pct_change < 0)
        .sort((a, b) => a[1].pct_change - b[1].pct_change)
        .slice(0, 3)
    : [];

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
      }}
    >

      <Navbar tickerItems={tickerItems} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-44 pb-12">
        {/* Welcome */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400/70 uppercase mb-2">Dashboard</p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Welcome back, {loggedInUser}
          </h1>
          <p className="text-white/40 text-sm mt-2">Here's what's happening on the Malawi Stock Exchange today.</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/15 mb-8">
            <svg className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-400/70 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Listed Stocks", value: stocks ? Object.keys(stocks).length.toString() : "—", accent: "text-white" },
            { label: "Gainers", value: gainers.length.toString(), accent: "text-green-400" },
            { label: "Losers", value: losers.length.toString(), accent: "text-red-400" },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-2xl font-bold ${accent}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Top Gainers */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Top Gainers</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : gainers.length === 0 ? (
              <p className="text-white/25 text-sm">No gainers today</p>
            ) : (
              <div className="space-y-3">
                {gainers.map(([name, d]) => (
                  <div
                    key={name}
                    onClick={() => router.push(`/pages/${name}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 cursor-pointer transition-all group"
                  >
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">{name}</p>
                      <p className="text-white/30 text-xs">MK {Number(d.close).toLocaleString()}</p>
                    </div>
                    <span className="text-green-400 text-sm font-bold">+{(d.pct_change * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Losers */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">Top Losers</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : losers.length === 0 ? (
              <p className="text-white/25 text-sm">No losers today</p>
            ) : (
              <div className="space-y-3">
                {losers.map(([name, d]) => (
                  <div
                    key={name}
                    onClick={() => router.push(`/pages/${name}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/6 cursor-pointer transition-all group"
                  >
                    <div>
                      <p className="text-white font-medium text-sm group-hover:text-blue-200 transition-colors">{name}</p>
                      <p className="text-white/30 text-xs">MK {Number(d.close).toLocaleString()}</p>
                    </div>
                    <span className="text-red-400 text-sm font-bold">{(d.pct_change * 100).toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Stocks */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white/60">All Listed Stocks</h2>
            <span className="text-white/20 text-xs">{stocks ? Object.keys(stocks).length : "—"} companies</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {/* Table header */}
              <div className="grid grid-cols-4 pb-3 text-xs font-bold tracking-widest uppercase text-white/20">
                <span>Company</span>
                <span className="text-right">Close</span>
                <span className="text-right">Volume</span>
                <span className="text-right">Change</span>
              </div>
              {stocks && Object.entries(stocks).map(([name, d]) => {
                const pctChange = d.pct_change * 100;
                const isPos = pctChange >= 0;
                return (
                  <div
                    key={name}
                    onClick={() => router.push(`/pages/${name}`)}
                    className="grid grid-cols-4 py-3.5 cursor-pointer hover:bg-white/3 rounded-lg px-1 transition-all group"
                  >
                    <span className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">{name}</span>
                    <span className="text-white/70 text-sm text-right">MK {Number(d.close).toLocaleString()}</span>
                    <span className="text-white/40 text-sm text-right">{Number(d.volume || 0).toLocaleString()}</span>
                    <span className={`text-sm text-right font-semibold ${isPos ? "text-green-400" : "text-red-400"}`}>
                      {isPos ? "+" : ""}{pctChange.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}