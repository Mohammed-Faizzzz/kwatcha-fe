"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Search,
  ArrowRight,
  ChevronsLeftRight,
  ArrowUpDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiFetch";
import { API_BASE } from "@/lib/constants";
import type { StockData, MarketResponse, MoversResponse } from "@/types/market";

type SortKey = "name" | "close" | "open" | "change" | "pct_change" | "volume" | "turnover";
type SortDir = "asc" | "desc";

export default function MarketPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [movers, setMovers] = useState<MoversResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [activeTab, setActiveTab] = useState<"all" | "gainers" | "losers">("all");

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

  const tickerItems = stocks
    ? Object.entries(stocks).map(([name, data]) => ({
        symbol: name,
        price: Number(data.close).toLocaleString(),
        change: parseFloat((data.pct_change * 100).toFixed(2)),
      }))
    : [];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filteredAndSorted = useMemo(() => {
    if (!stocks) return [];
    let entries = Object.entries(stocks);

    if (activeTab === "gainers") entries = entries.filter(([, d]) => d.pct_change > 0);
    if (activeTab === "losers") entries = entries.filter(([, d]) => d.pct_change < 0);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(([name]) => name.toLowerCase().includes(q));
    }

    entries.sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sortKey === "name") {
        av = a[0];
        bv = b[0];
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      av = parseFloat(String(a[1][sortKey])) || 0;
      bv = parseFloat(String(b[1][sortKey])) || 0;
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return entries;
  }, [stocks, search, sortKey, sortDir, activeTab]);

  const SortHeader = ({ label, col }: { label: string; col: SortKey }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 group text-t-fg25 hover:text-t-fg50 transition-colors text-xs font-bold tracking-widest uppercase"
    >
      {label}
      <ArrowUpDown
        size={10}
        className={`transition-colors ${sortKey === col ? "text-blue-400/70" : "text-t-fg15 group-hover:text-t-fg30"}`}
      />
    </button>
  );

  return (
    <div
      className="min-h-screen bg-t-bg text-t-fg"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, var(--t-grad1) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, var(--t-grad2) 0%, transparent 60%)",
      }}
    >
      <Navbar tickerItems={tickerItems} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-44 pb-28">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              Msika wa Kampani
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-t-fg">
            Market Overview
          </h1>
          <p className="text-t-fg40 mt-3 text-sm">
            Live prices and performance data for all companies listed on the MSE.
          </p>
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

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-t-card border border-t-line rounded-2xl p-5">
            <Activity className="text-blue-400/50 mb-3" size={18} />
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Listed Stocks</p>
            <p className="text-2xl font-bold text-t-fg">{movers?.summary.total_stocks ?? "—"}</p>
          </div>
          <div className="bg-t-card border border-t-line rounded-2xl p-5">
            <TrendingUp className="text-green-400/50 mb-3" size={18} />
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Gainers</p>
            <p className="text-2xl font-bold text-green-400">{movers?.summary.gainers ?? "—"}</p>
          </div>
          <div className="bg-t-card border border-t-line rounded-2xl p-5">
            <TrendingDown className="text-red-400/50 mb-3" size={18} />
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Losers</p>
            <p className="text-2xl font-bold text-red-400">{movers?.summary.losers ?? "—"}</p>
          </div>
          <div className="bg-t-card border border-t-line rounded-2xl p-5">
            <BarChart3 className="text-blue-400/50 mb-3" size={18} />
            <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">Total Turnover</p>
            <p className="text-xl font-bold text-t-fg truncate">
              {movers
                ? `MK ${Number(movers.summary.total_turnover).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`
                : "—"}
            </p>
          </div>
        </div>

        {/* Top movers row */}
        {!loading && movers && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-t-card border border-t-line rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-t-fg50">Top Gainers</h2>
              </div>
              <div className="space-y-2">
                {movers.top_gainers.slice(0, 3).map((m) => (
                  <div
                    key={m.ticker}
                    onClick={() => router.push(`/pages/${m.ticker}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-t-hover cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp size={14} className="text-green-400/60" />
                      <div>
                        <p className="text-t-fg text-sm font-semibold group-hover:text-blue-200 transition-colors">
                          {m.ticker}
                        </p>
                        {m.close && (
                          <p className="text-t-fg30 text-xs">MK {Number(m.close).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-bold">+{m.change.toFixed(2)}%</span>
                      <ArrowRight size={12} className="text-t-fg20 group-hover:text-blue-400/60 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-t-card border border-t-line rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-t-fg50">Top Losers</h2>
              </div>
              <div className="space-y-2">
                {movers.top_losers.slice(0, 3).map((m) => (
                  <div
                    key={m.ticker}
                    onClick={() => router.push(`/pages/${m.ticker}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-t-hover cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingDown size={14} className="text-red-400/60" />
                      <div>
                        <p className="text-t-fg text-sm font-semibold group-hover:text-blue-200 transition-colors">
                          {m.ticker}
                        </p>
                        {m.close && (
                          <p className="text-t-fg30 text-xs">MK {Number(m.close).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm font-bold">{m.change.toFixed(2)}%</span>
                      <ArrowRight size={12} className="text-t-fg20 group-hover:text-blue-400/60 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* All stocks table */}
        <div className="bg-t-card border border-t-line rounded-2xl p-6">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 bg-t-input rounded-xl p-1">
              {(["all", "gainers", "losers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-t-hover text-t-fg"
                      : "text-t-fg30 hover:text-t-fg60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-t-fg25 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-t-input border border-t-line rounded-xl pl-9 pr-4 py-2 text-sm text-t-fg placeholder:text-t-fg20 focus:outline-none focus:border-blue-500/40 transition-colors w-48"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-t-input rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-6 pb-3 border-b border-t-linef min-w-[600px]">
                <div className="col-span-2">
                  <SortHeader label="Company" col="name" />
                </div>
                <div className="text-right">
                  <SortHeader label="Close" col="close" />
                </div>
                <div className="text-right">
                  <SortHeader label="Open" col="open" />
                </div>
                <div className="text-right">
                  <SortHeader label="Volume" col="volume" />
                </div>
                <div className="text-right">
                  <SortHeader label="Change" col="pct_change" />
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-t-linef min-w-[600px]">
                {filteredAndSorted.length === 0 ? (
                  <p className="text-t-fg20 text-sm py-8 text-center">No stocks found.</p>
                ) : (
                  filteredAndSorted.map(([name, d]) => {
                    const pctChange = d.pct_change * 100;
                    const absChange = d.change;
                    const isPos = pctChange > 0;
                    const isNeg = pctChange < 0;
                    return (
                      <div
                        key={name}
                        onClick={() => router.push(`/pages/${name}`)}
                        className="grid grid-cols-6 py-3.5 px-1 cursor-pointer hover:bg-t-card rounded-lg transition-all group"
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <div
                            className={`w-1 h-6 rounded-full flex-shrink-0 ${
                              isPos ? "bg-green-500/40" : isNeg ? "bg-red-500/40" : "bg-t-hover"
                            }`}
                          />
                          <span className="text-t-fg text-sm font-semibold group-hover:text-blue-200 transition-colors">
                            {name}
                          </span>
                        </div>
                        <span className="text-t-fg80 text-sm text-right self-center">
                          MK {Number(d.close).toLocaleString()}
                        </span>
                        <span className="text-t-fg40 text-sm text-right self-center">
                          MK {Number(d.open).toLocaleString()}
                        </span>
                        <span className="text-t-fg40 text-sm text-right self-center">
                          {Number(d.volume || 0).toLocaleString()}
                        </span>
                        <div className="text-right self-center">
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${
                              isPos
                                ? "text-green-400 bg-green-500/10"
                                : isNeg
                                ? "text-red-400 bg-red-500/10"
                                : "text-yellow-400/70 bg-yellow-500/10"
                            }`}
                          >
                            {isPos ? (
                              <TrendingUp size={11} />
                            ) : isNeg ? (
                              <TrendingDown size={11} />
                            ) : (
                              <ChevronsLeftRight size={11} />
                            )}
                            {isPos ? "+" : ""}
                            {pctChange.toFixed(2)}%
                          </span>
                          <p className="text-t-fg25 text-xs mt-0.5">
                            {isPos ? "+" : ""}{absChange.toFixed(2)} MWK
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer count */}
              <p className="text-t-fg15 text-xs pt-5 border-t border-t-linef mt-3">
                Showing {filteredAndSorted.length} of {stocks ? Object.keys(stocks).length : 0} stocks
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
