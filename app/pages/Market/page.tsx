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
import type { StockData, MarketResponse, MoversResponse, IndicesResponse, DividendsResponse } from "@/types/market";
import TickerLogo from "@/components/TickerLogo";

const MOCK_INDICES: IndicesResponse["indices"] = {
  MASI: { name: "Malawi All Shares Index", value: 550034.70, change: -23135.85, pct_change: -0.0404 },
  DSI:  { name: "Domestic Shares Index",   value: 398503.56, change: -4335.70,  pct_change: -0.0108 },
  FSI:  { name: "Foreign Shares Index",    value: 115090.13, change: -19811.26, pct_change: -0.1469 },
};

const MOCK_DIVIDENDS: DividendsResponse["dividends"] = [
  {
    ticker: "STANDARD",
    payment_date: "Fri, 17th Apr 2026",
    amount_per_share: 14.23,
    dividend_type: "Interim",
    ex_dividend_date: "Wed, 8th Apr 2026",
    last_day_to_register: "Fri, 10th Apr 2026",
  },
  {
    ticker: "NITL",
    payment_date: "Fri, 17th Apr 2026",
    amount_per_share: 6.00,
    dividend_type: "Interim",
    ex_dividend_date: "Wed, 8th Apr 2026",
    last_day_to_register: "Fri, 10th Apr 2026",
  },
  {
    ticker: "NICO",
    payment_date: "Mon, 20th Apr 2026",
    amount_per_share: 20.00,
    dividend_type: "Interim",
    ex_dividend_date: "Wed, 8th Apr 2026",
    last_day_to_register: "Fri, 10th Apr 2026",
  },
];

type SortKey = "name" | "close" | "open" | "change" | "pct_change" | "volume" | "turnover";
type SortDir = "asc" | "desc";

export default function MarketPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [movers, setMovers] = useState<MoversResponse | null>(null);
  const [indices, setIndices] = useState<IndicesResponse["indices"] | null>(null);
  const [dividends, setDividends] = useState<DividendsResponse["dividends"] | null>(null);
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

    const fetchSupplemental = async () => {
      const [indicesRes, dividendsRes] = await Promise.allSettled([
        apiFetch<IndicesResponse>(`${API_BASE}/indices`),
        apiFetch<DividendsResponse>(`${API_BASE}/dividends`),
      ]);
      setIndices(indicesRes.status === "fulfilled" ? indicesRes.value.indices : MOCK_INDICES);
      setDividends(dividendsRes.status === "fulfilled" ? dividendsRes.value.dividends : MOCK_DIVIDENDS);
    };

    fetchData();
    fetchSupplemental();
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
      className="flex items-center gap-1 group text-white/25 hover:text-white/50 transition-colors text-xs font-bold tracking-widest uppercase"
    >
      {label}
      <ArrowUpDown
        size={10}
        className={`transition-colors ${sortKey === col ? "text-blue-400/70" : "text-white/15 group-hover:text-white/30"}`}
      />
    </button>
  );

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
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
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Market Overview
          </h1>
          <p className="text-white/40 mt-3 text-sm">
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

        {/* ── Indices ── */}
        {indices && (
          <div className="mb-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase mb-3">Market Indices</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["MASI", "DSI", "FSI"] as const).map((key) => {
                const idx = indices[key];
                const isNeg = idx.pct_change < 0;
                const fullNames: Record<string, string> = {
                  MASI: "Malawi All Shares Index",
                  DSI: "Domestic Shares Index",
                  FSI: "Foreign Shares Index",
                };
                return (
                  <div key={key} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-2xl font-black text-white tracking-tight">{key}</p>
                        <p className="text-white/30 text-xs mt-0.5">{fullNames[key]}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isNeg
                            ? "bg-red-500/10 text-red-400 border border-red-500/15"
                            : "bg-green-500/10 text-green-400 border border-green-500/15"
                        }`}
                      >
                        {isNeg ? "▼" : "▲"} {Math.abs(idx.pct_change * 100).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-white/25 text-[10px] uppercase tracking-widest mb-0.5">Value</p>
                    <p className="text-xl font-bold text-white">
                      {Number(idx.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs mt-1 font-medium ${isNeg ? "text-red-400/70" : "text-green-400/70"}`}>
                      {isNeg ? "▼" : "▲"} {isNeg ? "" : "+"}{Number(idx.change).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <Activity className="text-blue-400/50 mb-3" size={18} />
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Listed Stocks</p>
            <p className="text-2xl font-bold text-white">{movers?.summary.total_stocks ?? "—"}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <TrendingUp className="text-green-400/50 mb-3" size={18} />
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Gainers</p>
            <p className="text-2xl font-bold text-green-400">{movers?.summary.gainers ?? "—"}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <TrendingDown className="text-red-400/50 mb-3" size={18} />
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Losers</p>
            <p className="text-2xl font-bold text-red-400">{movers?.summary.losers ?? "—"}</p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <BarChart3 className="text-blue-400/50 mb-3" size={18} />
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total Turnover</p>
            <p className="text-xl font-bold text-white truncate">
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
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-white/50">Top Gainers</h2>
              </div>
              <div className="space-y-2">
                {movers.top_gainers.slice(0, 3).map((m) => (
                  <div
                    key={m.ticker}
                    onClick={() => router.push(`/pages/${m.ticker}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TickerLogo ticker={m.ticker} size={32} />
                      <div>
                        <p className="text-white text-sm font-semibold group-hover:text-blue-200 transition-colors">
                          {m.ticker}
                        </p>
                        {m.close && (
                          <p className="text-white/30 text-xs">MK {Number(m.close).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-bold">+{m.change.toFixed(2)}%</span>
                      <ArrowRight size={12} className="text-white/20 group-hover:text-blue-400/60 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-white/50">Top Losers</h2>
              </div>
              <div className="space-y-2">
                {movers.top_losers.slice(0, 3).map((m) => (
                  <div
                    key={m.ticker}
                    onClick={() => router.push(`/pages/${m.ticker}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TickerLogo ticker={m.ticker} size={32} />
                      <div>
                        <p className="text-white text-sm font-semibold group-hover:text-blue-200 transition-colors">
                          {m.ticker}
                        </p>
                        {m.close && (
                          <p className="text-white/30 text-xs">MK {Number(m.close).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm font-bold">{m.change.toFixed(2)}%</span>
                      <ArrowRight size={12} className="text-white/20 group-hover:text-blue-400/60 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Upcoming Dividends ── */}
        {dividends && dividends.length > 0 && (
          <div className="mb-10">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase mb-3">Upcoming Dividends</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dividends.map((d, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-bold text-base">{d.ticker}</p>
                      {d.company_name && (
                        <p className="text-white/30 text-xs mt-0.5">{d.company_name}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/20 uppercase tracking-wide">
                      {d.dividend_type}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-white/25 text-[10px] uppercase tracking-widest mb-0.5">Amount</p>
                    <p className="text-white font-bold text-lg">MK {Number(d.amount_per_share).toLocaleString(undefined, { minimumFractionDigits: 2 })}/share</p>
                  </div>
                  <div className="space-y-2 border-t border-white/6 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Payment Date</span>
                      <span className="text-white/70 text-xs font-medium">{d.payment_date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Ex-Dividend Date</span>
                      <span className="text-orange-300/80 text-xs font-medium">{d.ex_dividend_date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Last Day to Register</span>
                      <span className="text-orange-300/80 text-xs font-medium">{d.last_day_to_register}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All stocks table */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              {(["all", "gainers", "losers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-white/10 text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search ticker..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-colors w-48"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-6 pb-3 border-b border-white/5 min-w-[600px]">
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
              <div className="divide-y divide-white/[0.04] min-w-[600px]">
                {filteredAndSorted.length === 0 ? (
                  <p className="text-white/20 text-sm py-8 text-center">No stocks found.</p>
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
                        className="grid grid-cols-6 py-3.5 px-1 cursor-pointer hover:bg-white/[0.03] rounded-lg transition-all group"
                      >
                        <div className="col-span-2 flex items-center gap-3">
                          <TickerLogo ticker={name} size={28} />
                          <span className="text-white text-sm font-semibold group-hover:text-blue-200 transition-colors">
                            {name}
                          </span>
                        </div>
                        <span className="text-white/80 text-sm text-right self-center">
                          MK {Number(d.close).toLocaleString()}
                        </span>
                        <span className="text-white/40 text-sm text-right self-center">
                          MK {Number(d.open).toLocaleString()}
                        </span>
                        <span className="text-white/40 text-sm text-right self-center">
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
                          <p className="text-white/25 text-xs mt-0.5">
                            {isPos ? "+" : ""}{absChange.toFixed(2)} MWK
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer count */}
              <p className="text-white/15 text-xs pt-5 border-t border-white/5 mt-3">
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
