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

interface StockData {
  ticker: string;
  open?: string | number;
  close?: string | number;
  change?: string | number;
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
  const [activeTab, setActiveTab] = useState("background");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [shares, setShares] = useState<string>("");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const info = companyData[ticker];

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await fetch("https://kwatcha-api.onrender.com/stocks");
        const data = await res.json();
        setStock(data.stocks[ticker] || null);
      } catch (err) {
        console.error(err);
        setStock(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [ticker]);

  useEffect(() => {
    const stored = localStorage.getItem("mse_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.loggedIn) setLoggedInUser(parsed.username);
      } catch {}
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/40">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading...
      </div>
    </div>
  );

  if (!stock) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-white/40">Stock not found</p>
    </div>
  );

  const open = Number(stock.open ?? 0);
  const close = Number(stock.close ?? 0);
  const change = Number(stock.change ?? 0);
  const volume = Number(stock.volume ?? 0);
  const yearChange = Number(stock.yearChange ?? 0);
  const week52Range: [number, number] = [
    Number(stock.week52Range?.[0] ?? 0),
    Number(stock.week52Range?.[1] ?? 0),
  ];
  const liquidity = Number(stock.liquidity ?? 0);
  const marketCap = Number(stock.marketCap ?? 0);
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isUnchanged = change === 0;

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
      const res = await fetch("https://kwatcha-api.onrender.com/orders", {
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
      className="min-h-screen bg-black text-white pb-24"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.07) 0%, transparent 60%)",
      }}
    >
      <Navbar />

      <section className="px-6 md:px-12 pt-28 pb-12 max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 text-white/30 hover:text-white/60 text-sm transition-colors mb-6"
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
              <h1 className="text-4xl font-bold text-white">
                {info?.fullName ?? ticker}
              </h1>
              <p className="text-white/30 text-sm mt-1">{ticker} · MSE</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                MK {close.toLocaleString()}
              </p>
              <p className={`text-sm font-semibold mt-1 flex items-center justify-end gap-1 ${isUnchanged ? "text-yellow-400" : isPositive ? "text-green-400" : "text-red-400"}`}>
                {isUnchanged ? <ChevronsLeftRight size={14} /> : null}
                {isUnchanged ? "0.00%" : `${isPositive ? "+" : ""}${change.toFixed(2)}%`} today
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: "Open", value: `MK ${open.toLocaleString()}` },
            { label: "Close", value: `MK ${close.toLocaleString()}` },
            { label: "Today's Change", value: isUnchanged ? "0.00%" : `${isPositive ? "+" : ""}${change.toFixed(2)}%` },
            { label: "Volume", value: volume >= 1000 ? `${(volume / 1000).toFixed(1)}K` : volume.toString() },
            { label: "1 Year Change", value: `${yearChange >= 0 ? "+" : ""}${yearChange.toFixed(2)}%` },
            { label: "52 Week Range", value: `${week52Range[0].toLocaleString()} – ${week52Range[1].toLocaleString()}` },
            { label: "1Y Liquidity", value: `MK ${(liquidity / 1e6).toFixed(1)}M` },
            { label: "Market Cap", value: marketCap >= 1e12 ? `MK ${(marketCap / 1e12).toFixed(2)}T` : `MK ${(marketCap / 1e9).toFixed(1)}B` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1">{label}</p>
              <p className="text-white font-semibold text-sm">{value}</p>
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
              <div key={label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <p className="text-white/25 text-xs uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white/70 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Price History</p>
          {stock.history && stock.history.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stock.history}>
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff" }}
                  labelStyle={{ color: "rgba(255,255,255,0.5)" }}
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
            <p className="text-white/25 text-center py-16 text-sm">Historical data not available</p>
          )}
        </div>

        {/* Order Panel */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
          <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Place Order</p>

          {!loggedInUser ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/8">
              <p className="text-white/40 text-sm">You must be logged in to place orders.</p>
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
              <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1 w-fit">
                {(["buy", "sell"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setOrderType(t); setOrderSuccess(null); setOrderError(null); }}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                      orderType === t
                        ? t === "buy" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {t === "buy" ? "Buy" : "Sell"}
                  </button>
                ))}
              </div>

              {/* Inputs row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-white/30 uppercase">Shares</label>
                  <input
                    type="number" min="1" value={shares}
                    onChange={(e) => { setShares(e.target.value); setOrderError(null); setOrderSuccess(null); }}
                    placeholder="e.g. 100"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/60 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-white/30 uppercase">Price per Share</label>
                  <div className="bg-white/[0.02] border border-white/8 rounded-lg px-4 py-2.5 text-white/50 text-sm">
                    MK {close.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold tracking-widest text-white/30 uppercase">Estimated Total</label>
                  <div className="bg-white/[0.02] border border-white/8 rounded-lg px-4 py-2.5 text-white/70 text-sm font-semibold">
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

              <p className="text-white/20 text-xs">
                Logged in as @{loggedInUser} · Orders are subject to market availability and broker confirmation.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 min-h-48">

          {/* Background */}
          {activeTab === "background" && (
            <div className="space-y-4">
              <p className="text-white/70 leading-relaxed">
                {info?.description ?? "No company background available."}
              </p>
              {info?.mission && (
                <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <p className="text-xs font-bold tracking-widest uppercase text-blue-400/60 mb-2">Mission</p>
                  <p className="text-white/60 text-sm italic">"{info.mission}"</p>
                </div>
              )}
              {info?.vision && (
                <div className="mt-2 p-4 rounded-xl bg-white/[0.02] border border-white/8">
                  <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-2">Vision</p>
                  <p className="text-white/60 text-sm italic">"{info.vision}"</p>
                </div>
              )}
              {info && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {info.headquarters && (
                    <div className="flex gap-2 text-white/40">
                      <span className="shrink-0">📍</span>
                      <span>{info.headquarters}</span>
                    </div>
                  )}
                  {info.phone && (
                    <div className="flex gap-2 text-white/40">
                      <span className="shrink-0">📞</span>
                      <span>{info.phone}</span>
                    </div>
                  )}
                  {info.website && (
                    <div className="flex gap-2 text-white/40">
                      <span className="shrink-0">🌐</span>
                      <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">{info.website}</a>
                    </div>
                  )}
                  {info.indices && (
                    <div className="flex gap-2 text-white/40">
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
                    <div key={label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                      <p className="text-white/30 text-xs uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-white font-semibold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm">No financial data available.</p>
              )}
              {info?.financials?.notes && (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/8">
                  <p className="text-white/50 text-sm leading-relaxed">{info.financials.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Leadership */}
          {activeTab === "leadership" && (
            <div className="space-y-3">
              {info?.leadership && info.leadership.length > 0 ? (
                info.leadership.map((person, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white/[0.03] border border-white/8 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{person.name}</p>
                      <p className="text-blue-400/70 text-xs font-medium mt-0.5">{person.role}</p>
                      {person.bio && <p className="text-white/40 text-sm mt-2 leading-relaxed">{person.bio}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/40 text-sm">No leadership information available.</p>
              )}
            </div>
          )}

          {/* News */}
          {activeTab === "news" && (
            <div className="space-y-6">
              {/* Articles */}
              {info?.articles && info.articles.length > 0 && (
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Articles</p>
                  <div className="space-y-2">
                    {info.articles.map((article, i) => (
                      <a
                        key={i}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 hover:border-blue-500/30 hover:bg-white/[0.05] rounded-xl transition-all group"
                      >
                        <div>
                          <p className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">{article.title}</p>
                          <p className="text-white/25 text-xs mt-1">{article.date}</p>
                        </div>
                        <svg className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Trading Updates</p>
                  <div className="space-y-2">
                    {info.tradingUpdates.map((update, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 rounded-xl">
                        <div>
                          <p className="text-white text-sm font-medium">{update.title}</p>
                          <p className="text-white/25 text-xs mt-1">{update.date}</p>
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
                  <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-3">Podcasts & Media</p>
                  <div className="space-y-2">
                    {info.podcasts.map((pod, i) => (
                      <a
                        key={i}
                        href={pod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/8 hover:border-blue-500/30 rounded-xl transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 12.87l-10-6A1 1 0 008 7.87v12a1 1 0 001.59.8l10-6a1 1 0 000-1.8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium group-hover:text-blue-200 transition-colors">{pod.title}</p>
                          <p className="text-white/25 text-xs mt-0.5">{pod.date}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {(!info?.articles?.length && !info?.tradingUpdates?.length && !info?.podcasts?.length) && (
                <p className="text-white/40 text-sm">No news available.</p>
              )}
            </div>
          )}

          {/* Sustainability */}
          {activeTab === "sustainability" && (
            <div>
              {info?.sustainability ? (
                <p className="text-white/70 leading-relaxed">{info.sustainability}</p>
              ) : (
                <p className="text-white/40 text-sm">No sustainability information available.</p>
              )}
            </div>
          )}
        </div>

      </section>
      <Footer />
    </div>
  );
}