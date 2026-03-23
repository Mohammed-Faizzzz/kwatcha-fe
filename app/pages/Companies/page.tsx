"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ArrowRight, Search, Building2, ChevronsLeftRight, TrendingUp, TrendingDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { companyData } from "@/lib/companyData";

interface StockData {
  open: string;
  close: string;
  change: string;
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
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("All");

  useEffect(() => {
    fetch("https://kwatcha-api-production.up.railway.app/stocks")
      .then((r) => r.json())
      .then((d: MarketResponse) => setStocks(d.stocks))
      .catch(console.error);
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

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
      }}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-28">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400/70 uppercase mb-3">
            Malawi Stock Exchange
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Listed Companies</h1>
          <p className="text-white/40 text-sm">
            All {Object.keys(companyData).length} companies currently listed on the MSE.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-colors w-56"
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
                    : "bg-white/5 border border-white/8 text-white/40 hover:text-white/70"
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
                className="group bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-white/[0.05] rounded-2xl p-6 transition-all cursor-pointer flex flex-col gap-4"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-white/25 font-bold tracking-widest uppercase">
                      {ticker}
                    </span>
                    <p className="text-white font-semibold mt-0.5 group-hover:text-blue-200 transition-colors leading-tight">
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
                    <span className="w-14 h-5 bg-white/5 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Sector badge */}
                <div className="flex items-center gap-2">
                  <Building2 size={11} className="text-white/20" />
                  <span className="text-xs text-white/30">{company.sector}</span>
                </div>

                {/* Description */}
                <p className="text-white/35 text-xs leading-relaxed line-clamp-3">
                  {company.description}
                </p>

                {/* Price + link */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                  <span className="text-white/70 text-sm font-semibold">
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
          <p className="text-white/20 text-sm text-center py-16">No companies match your search.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
