"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronsLeftRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { companyData } from "@/lib/companyData";
import { apiFetch } from "@/lib/apiFetch";
import { API_BASE } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

interface StockData {
  ticker: string;
  open?: string | number;
  close?: string | number;
  change?: number;
  pct_change?: number;
  volume?: string | number;
  yearChange?: string | number;
  week52Range?: [string | number, string | number];
  liquidity?: string | number;
  marketCap?: string | number;
  history?: { date: string; close: number }[];
}

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = (params?.ticker as string)?.toUpperCase();

  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("background");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [shares, setShares] = useState<string>("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { username: loggedInUser } = useAuth();
  const [priceHistory, setPriceHistory] = useState<{ date: string; close: number }[]>([]);
  const [tickerItems, setTickerItems] = useState<{ symbol: string; price: string; change: number }[]>([]);

  const info = companyData[ticker];

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await apiFetch<{ stocks: Record<string, StockData> }>(
          `${API_BASE}/stocks`
        );
        setStock(data.stocks[ticker] || null);
        setTickerItems(
          Object.entries(data.stocks).map(([name, d]) => ({
            symbol: name,
            price: Number(d.close).toLocaleString(),
            change: parseFloat(((d.pct_change ?? 0) * 100).toFixed(2)),
          }))
        );
        console.log(stock);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : "Failed to load stock data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [ticker]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await apiFetch<{ history: { close: number; snapshot_at: string }[] }>(
          `${API_BASE}/history/${ticker}`
        );
        setPriceHistory(
          data.history.map((h) => ({
            date: new Date(h.snapshot_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            close: h.close,
          }))
        );
      } catch {
        // silently fall back to empty — chart will show "not available"
      }
    };
    fetchHistory();
  }, [ticker]);

  if (loading) return (
    <div className="min-h-screen bg-t-bg flex items-center justify-center">
      <div className="flex items-center gap-3 text-t-fg40">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading...
      </div>
    </div>
  );

  if (fetchError) return (
    <div className="min-h-screen bg-t-bg flex items-center justify-center px-4">
      <div className="flex items-start gap-3 p-5 rounded-xl bg-red-500/8 border border-red-500/15 max-w-md w-full">
        <svg className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <p className="text-red-400/70 text-sm leading-relaxed">{fetchError}</p>
      </div>
    </div>
  );

  if (!stock) return (
    <div className="min-h-screen bg-t-bg flex items-center justify-center">
      <p className="text-t-fg40">Stock not found</p>
    </div>
  );

  const open = Number(stock.open ?? 0);
  const close = Number(stock.close ?? 0);
  const absChange = Number(stock.change ?? 0);
  const pctChange = Number(stock.pct_change ?? 0) * 100;
  const volume = Number(stock.volume ?? 0);
  const yearChange = Number(stock.yearChange ?? 0);
  const week52Range: [number, number] = [
    Number(stock.week52Range?.[0] ?? 0),
    Number(stock.week52Range?.[1] ?? 0),
  ];
  const liquidity = Number(stock.liquidity ?? 0);
  const marketCap = Number(stock.marketCap ?? 0);
  const isPositive = absChange > 0;
  const isNegative = absChange < 0;
  const isUnchanged = absChange === 0;

  const tabs = ["background", "financials", "leadership", "news", "sustainability"];

  const handleOrder = async () => {
    if (!shares || isNaN(Number(shares)) || Number(shares) <= 0) {
      setOrderError("Please enter a valid number of shares.");
      return;
    }
    setOrderLoading(true);
    setOrderError(null);
    setOrderSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loggedInUser,
          ticker,
          type: orderType,
          shares: Number(shares),
          price: close,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message || `Error ${res.status}`);
      }
      setOrderSuccess(`${orderType === "buy" ? "Buy" : "Sell"} order placed for ${shares} shares of ${ticker}.`);
      setShares("");
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : "Order failed.");
    } finally {
      setOrderLoading(false);
    }
  };

  const estimatedTotal = shares && !isNaN(Number(shares)) ? (Number(shares) * close).toLocaleString() : "—";


  return (
    <div
      className="min-h-screen bg-t-bg text-t-fg pb-24"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, var(--t-grad1) 0%, transparent 60%)",
      }}
    >
      <Navbar tickerItems={tickerItems} />

      <section className="px-4 md:px-6 pt-44 pb-12 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-t-fg30 hover:text-t-fg60 text-sm transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {info?.sector && (
                <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
                  {info.sector}
                </p>
              )}
              <h1 className="text-4xl font-bold text-t-fg">
                {info?.fullName ?? ticker}
              </h1>
              <p className="text-t-fg30 text-sm mt-1">{ticker} · MSE</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-t-fg">
                MK {close.toLocaleString()}
              </p>
              <p className={`text-sm font-semibold mt-1 flex items-center justify-end gap-1 ${isUnchanged ? "text-yellow-400" : isPositive ? "text-green-400" : "text-red-400"}`}>
                {isUnchanged ? <ChevronsLeftRight size={14} /> : null}
                {isUnchanged ? "0.00%" : `${isPositive ? "+" : ""}${pctChange.toFixed(2)}%`} today
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: "Open", value: `MK ${open.toLocaleString()}` },
            { label: "Close", value: `MK ${close.toLocaleString()}` },
            { label: "Change (MWK)", value: isUnchanged ? "0.00" : `${isPositive ? "+" : ""}${absChange.toFixed(2)}` },
            { label: "Change (%)", value: isUnchanged ? "0.00%" : `${isPositive ? "+" : ""}${pctChange.toFixed(2)}%` },
            { label: "Volume", value: volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume.toString() },
            { label: "1 Year Change", value: `${yearChange >= 0 ? "+" : ""}${yearChange.toFixed(2)}%` },
            { label: "52 Week Range", value: `${week52Range[0].toLocaleString()} – ${week52Range[1].toLocaleString()}` },
            { label: "1Y Liquidity", value: `MK ${(liquidity / 1e6).toFixed(1)}M` },
            { label: "Market Cap", value: marketCap >= 1e12 ? `MK ${(marketCap / 1e12).toFixed(2)}T` : `MK ${(marketCap / 1e9).toFixed(1)}B` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-t-card border border-t-line rounded-xl p-4">
              <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">{label}</p>
              <p className="text-t-fg font-semibold text-sm">{value}</p>
            </div>
          ))}
        </div>

        {/* Company quick facts from companyData */}
        {info && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Founded", value: info.founded },
              { label: "Listed", value: info.listed },
              { label: "Year End", value: info.yearEnd },
              { label: "Employees", value: info.employees?.split(" ").slice(0, 3).join(" ") },
            ].filter(f => f.value).map(({ label, value }) => (
              <div key={label} className="bg-t-card2 border border-t-linef rounded-xl p-4">
                <p className="text-t-fg25 text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-t-fg70 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="bg-t-card border border-t-line rounded-2xl p-5">
          <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-4">Price History</p>
          {priceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={priceHistory}>
                <XAxis dataKey="date" tick={{ fill: "var(--t-chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--t-chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--t-chart-tip)", border: "1px solid var(--t-chart-tip-b)", borderRadius: 8, color: "#fff" }}
                  labelStyle={{ color: "var(--t-chart-label)" }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke={isPositive ? "#4ade80" : "#f87171"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-t-fg25 text-center py-16 text-sm">Historical data not available</p>
          )}
        </div>

        {/* Order Panel */}
        <div className="bg-t-card border border-t-line rounded-2xl p-6">
          <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-5">Place Order</p>

          {!loggedInUser ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-t-card2 border border-t-line">
              <p className="text-t-fg40 text-sm">You must be logged in to place orders.</p>
              <button
                onClick={() => router.push("/")}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Log In →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Buy / Sell toggle */}
              <div className="flex gap-1 bg-t-card border border-t-line rounded-xl p-1 w-fit">
                {(["buy", "sell"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setOrderType(t); setOrderSuccess(null); setOrderError(null); }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      orderType === t
                        ? t === "buy" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        : "text-t-fg40 hover:text-t-fg70"
                    }`}
                  >
                    {t === "buy" ? "Buy" : "Sell"}
                  </button>
                ))}
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-t-fg30 uppercase">Shares</label>
                  <input
                    type="number" min="1" value={shares}
                    onChange={(e) => { setShares(e.target.value); setOrderError(null); setOrderSuccess(null); }}
                    placeholder="e.g. 100"
                    className="w-full bg-t-input border border-t-linei focus:border-blue-500/60 rounded-lg px-4 py-2.5 text-t-fg text-sm placeholder-white/20 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-t-fg30 uppercase">Price per Share</label>
                  <div className="bg-t-card2 border border-t-line rounded-lg px-4 py-2.5 text-t-fg50 text-sm">
                    MK {close.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-t-fg30 uppercase">Estimated Total</label>
                  <div className="bg-t-card2 border border-t-line rounded-lg px-4 py-2.5 text-t-fg70 text-sm font-semibold">
                    MK {estimatedTotal}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              {orderError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <p className="text-red-400 text-xs">{orderError}</p>
                </div>
              )}
              {orderSuccess && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  <p className="text-green-400 text-xs">{orderSuccess}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleOrder}
                disabled={orderLoading || !shares}
                className={`px-8 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 ${
                  orderType === "buy"
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {orderLoading
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Placing order...</>
                  : `Place ${orderType === "buy" ? "Buy" : "Sell"} Order`
                }
              </button>

              <p className="text-t-fg20 text-xs">
                Logged in as @{loggedInUser} · Orders are subject to market availability and broker confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-t-card border border-t-line rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-t-fg40 hover:text-t-fg70"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-t-card border border-t-line rounded-2xl p-6 min-h-48">

          {/* Background */}
          {activeTab === "background" && (
            <div className="space-y-4">
              <p className="text-t-fg70 leading-relaxed">
                {info?.description ?? "No company background available."}
              </p>
              {info?.mission && (
                <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <p className="text-xs font-bold tracking-widest uppercase text-blue-400/60 mb-2">Mission</p>
                  <p className="text-t-fg60 text-sm italic">"{info.mission}"</p>
                </div>
              )}
              {info?.vision && (
                <div className="mt-2 p-4 rounded-xl bg-t-card2 border border-t-line">
                  <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-2">Vision</p>
                  <p className="text-t-fg60 text-sm italic">"{info.vision}"</p>
                </div>
              )}
              {info && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {info.headquarters && (
                    <div className="flex gap-2 text-t-fg40">
                      <span className="shrink-0">📍</span>
                      <span>{info.headquarters}</span>
                    </div>
                  )}
                  {info.phone && (
                    <div className="flex gap-2 text-t-fg40">
                      <span className="shrink-0">📞</span>
                      <span>{info.phone}</span>
                    </div>
                  )}
                  {info.website && (
                    <div className="flex gap-2 text-t-fg40">
                      <span className="shrink-0">🌐</span>
                      <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">{info.website}</a>
                    </div>
                  )}
                  {info.indices && (
                    <div className="flex gap-2 text-t-fg40">
                      <span className="shrink-0">📊</span>
                      <span>{info.indices.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Financials */}
          {activeTab === "financials" && (
            <div className="space-y-4">
              {info?.financials?.keyFigures && info.financials.keyFigures.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {info.financials.keyFigures.map(({ label, value }) => (
                    <div key={label} className="bg-t-card border border-t-line rounded-xl p-4">
                      <p className="text-t-fg30 text-xs uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-t-fg font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-t-fg40 text-sm">No financial data available.</p>
              )}
              {info?.financials?.notes && (
                <div className="p-4 rounded-xl bg-t-card2 border border-t-line">
                  <p className="text-t-fg50 text-sm leading-relaxed">{info.financials.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Leadership */}
          {activeTab === "leadership" && (
            <div className="space-y-3">
              {info?.leadership && info.leadership.length > 0 ? (
                info.leadership.map((person, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-t-card border border-t-line rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-t-fg font-semibold">{person.name}</p>
                      <p className="text-blue-400/70 text-xs font-medium mt-0.5">{person.role}</p>
                      {person.bio && <p className="text-t-fg40 text-sm mt-2 leading-relaxed">{person.bio}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-t-fg40 text-sm">No leadership information available.</p>
              )}
            </div>
          )}

          {/* News */}
          {activeTab === "news" && (
            <div className="space-y-6">
              {/* Articles */}
              {info?.articles && info.articles.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-3">Articles</p>
                  <div className="space-y-2">
                    {info.articles.map((article, i) => (
                      <a
                        key={i}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-t-card border border-t-line hover:border-blue-500/30 hover:bg-t-hover rounded-xl transition-all group"
                      >
                        <div>
                          <p className="text-t-fg text-sm font-medium group-hover:text-blue-200 transition-colors">{article.title}</p>
                          <p className="text-t-fg25 text-xs mt-1">{article.date}</p>
                        </div>
                        <svg className="w-4 h-4 text-t-fg20 group-hover:text-blue-400 transition-colors shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Trading Updates */}
              {info?.tradingUpdates && info.tradingUpdates.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-3">Trading Updates</p>
                  <div className="space-y-2">
                    {info.tradingUpdates.map((update, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-t-card border border-t-line rounded-xl">
                        <div>
                          <p className="text-t-fg text-sm font-medium">{update.title}</p>
                          <p className="text-t-fg25 text-xs mt-1">{update.date}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-500/10 text-blue-400/80 border border-blue-500/15 shrink-0 ml-4">
                          {update.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Podcasts */}
              {info?.podcasts && info.podcasts.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-t-fg30 mb-3">Podcasts & Media</p>
                  <div className="space-y-2">
                    {info.podcasts.map((pod, i) => (
                      <a
                        key={i}
                        href={pod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-t-card border border-t-line hover:border-blue-500/30 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 12.87l-10-6A1 1 0 008 7.87v12a1 1 0 001.59.8l10-6a1 1 0 000-1.8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-t-fg text-sm font-medium group-hover:text-blue-200 transition-colors">{pod.title}</p>
                          <p className="text-t-fg25 text-xs mt-0.5">{pod.date}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {(!info?.articles?.length && !info?.tradingUpdates?.length && !info?.podcasts?.length) && (
                <p className="text-t-fg40 text-sm">No news available.</p>
              )}
            </div>
          )}

          {/* Sustainability */}
          {activeTab === "sustainability" && (
            <div>
              {info?.sustainability ? (
                <p className="text-t-fg70 leading-relaxed">{info.sustainability}</p>
              ) : (
                <p className="text-t-fg40 text-sm">No sustainability information available.</p>
              )}
            </div>
          )}
        </div>

      </section>
      <Footer />
    </div>
  );
}