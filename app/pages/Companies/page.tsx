"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ArrowRight, Search, Building2, ChevronsLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { companyData } from "@/lib/companyData";
import { apiFetch } from "@/lib/apiFetch";

interface StockData {
  open: string;
  close: string;
  change: string;
  pct_change?: number;
  volume: string;
  turnover: string;
}

interface MarketResponse {
  stocks: Record<string, StockData>;
}

const SECTORS = ["All", ...Array.from(new Set(Object.values(companyData).map((c) => c.sector))).sort()];

export default function CompaniesPage() {
  const router = useRouter();
  const [stocks, setStocks] = useState<Record<string, StockData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  useEffect(() => {
    apiFetch<MarketResponse>("https://kwatcha-api-production.up.railway.app/stocks")
      .then((d) => setStocks(d.stocks))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load stock data."));
  }, []);

  const companies = useMemo(() => {
    let entries = Object.entries(companyData);

    if (sector !== "All") entries = entries.filter(([, c]) => c.sector === sector);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(
        ([ticker, c]) =>
          ticker.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [search, sector]);

  const tickerItems = stocks
    ? Object.entries(stocks).map(([name, data]) => ({
        symbol: name,
        price: Number(data.close).toLocaleString(),
        change: data.pct_change != null ? parseFloat((data.pct_change * 100).toFixed(2)) : 0,
      }))
    : [];

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
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              Msika wa Kampani
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-t-fg mb-3">Listed Companies</h1>
          <p className="text-t-fg40 text-sm">
            All {Object.keys(companyData).length} companies currently listed on the MSE.
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-t-fg25 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-t-input border border-t-line rounded-xl pl-9 pr-4 py-2 text-sm text-t-fg placeholder:text-t-fg20 focus:outline-none focus:border-blue-500/40 transition-colors w-56"
            />
          </div>

          {/* Sector filter */}
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  sector === s
                    ? "bg-blue-600/30 border border-blue-500/40 text-blue-300"
                    : "bg-t-input border border-t-line text-t-fg40 hover:text-t-fg70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(([ticker, company]) => {
            const stock = stocks?.[ticker];
            const change = stock ? parseFloat(stock.change) || 0 : null;
            const isPos = change !== null && change > 0;
            const isNeg = change !== null && change < 0;

            return (
              <div
                key={ticker}
                onClick={() => router.push(`/pages/${ticker}`)}
                className="group bg-t-card border border-t-line hover:border-blue-500/30 hover:bg-t-hover rounded-2xl p-6 transition-all cursor-pointer flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-t-fg25 font-bold tracking-widest uppercase">
                      {ticker}
                    </span>
                    <p className="text-t-fg font-semibold mt-0.5 group-hover:text-blue-200 transition-colors leading-tight">
                      {company.fullName}
                    </p>
                  </div>
                  {change !== null ? (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                        isPos
                          ? "bg-green-500/10 text-green-400 border border-green-500/15"
                          : isNeg
                          ? "bg-red-500/10 text-red-400 border border-red-500/15"
                          : "bg-yellow-500/10 text-yellow-400/80 border border-yellow-500/15"
                      }`}
                    >
                      {isPos ? <TrendingUp size={10} /> : isNeg ? <TrendingDown size={10} /> : <ChevronsLeftRight size={10} />}
                      {isPos ? "+" : ""}
                      {change.toFixed(2)}%
                    </span>
                  ) : (
                    <span className="w-14 h-5 bg-t-input rounded-full animate-pulse" />
                  )}
                </div>

                {/* Sector badge */}
                <div className="flex items-center gap-2">
                  <Building2 size={11} className="text-t-fg20" />
                  <span className="text-xs text-t-fg30">{company.sector}</span>
                </div>

                {/* Description */}
                <p className="text-t-fg35 text-xs leading-relaxed line-clamp-3">
                  {company.description}
                </p>

                {/* Price + link */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-t-linef">
                  <span className="text-t-fg70 text-sm font-semibold">
                    {stock ? `MK ${Number(stock.close).toLocaleString()}` : "—"}
                  </span>
                  <span className="text-blue-400/50 text-xs group-hover:text-blue-400 transition-colors flex items-center gap-1">
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {companies.length === 0 && (
          <p className="text-t-fg20 text-sm text-center py-16">No companies match your search.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
