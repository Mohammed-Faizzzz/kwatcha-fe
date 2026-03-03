"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { companyData } from "@/lib/companyData";

interface Holding { ticker: string; shares: number; avgCost: number; }
interface Order { id: string; ticker: string; type: "buy"|"sell"; shares: number; price: number; status: "filled"|"pending"|"cancelled"; date: string; }
interface StockPrices { [ticker: string]: { close: number }; }

const MOCK_HOLDINGS: Holding[] = [
  { ticker: "AIRTEL", shares: 500,  avgCost: 215.00  },
  { ticker: "NBM",    shares: 120,  avgCost: 1840.00 },
  { ticker: "TNM",    shares: 1000, avgCost: 38.50   },
  { ticker: "FDHB",   shares: 300,  avgCost: 120.00  },
  { ticker: "PCL",    shares: 80,   avgCost: 3200.00 },
];

const MOCK_ORDERS: Order[] = [
  { id: "ORD001", ticker: "AIRTEL", type: "buy",  shares: 500,  price: 215.00,  status: "filled",    date: "2025-01-10" },
  { id: "ORD002", ticker: "NBM",    type: "buy",  shares: 120,  price: 1840.00, status: "filled",    date: "2025-01-15" },
  { id: "ORD003", ticker: "TNM",    type: "buy",  shares: 1000, price: 38.50,   status: "filled",    date: "2025-02-03" },
  { id: "ORD004", ticker: "TNM",    type: "sell", shares: 200,  price: 42.00,   status: "filled",    date: "2025-03-12" },
  { id: "ORD005", ticker: "FDHB",   type: "buy",  shares: 300,  price: 120.00,  status: "filled",    date: "2025-04-01" },
  { id: "ORD006", ticker: "PCL",    type: "buy",  shares: 80,   price: 3200.00, status: "filled",    date: "2025-05-20" },
  { id: "ORD007", ticker: "ILLOVO", type: "buy",  shares: 150,  price: 890.00,  status: "pending",   date: "2026-03-01" },
  { id: "ORD008", ticker: "NBM",    type: "sell", shares: 50,   price: 2100.00, status: "cancelled", date: "2026-02-14" },
];

const MOCK_CASH = 450000;

export default function PortfolioPage() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [prices, setPrices] = useState<StockPrices>({});
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [activeTab, setActiveTab] = useState<"holdings"|"orders">("holdings");

  useEffect(() => {
    const stored = localStorage.getItem("mse_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.loggedIn) setLoggedInUser(parsed.username);
        else router.push("/");
      } catch { router.push("/"); }
    } else router.push("/");
  }, []);

  useEffect(() => {
    fetch("https://kwatcha-api.onrender.com/stocks")
      .then(r => r.json())
      .then(data => {
        const map: StockPrices = {};
        Object.entries(data.stocks as Record<string, {close: string|number}>).forEach(([t, d]) => {
          map[t] = { close: Number(d.close) };
        });
        setPrices(map);
      })
      .finally(() => setLoadingPrices(false));
  }, []);

  const holdingsWithPnL = MOCK_HOLDINGS.map(h => {
    const currentPrice = prices[h.ticker]?.close ?? h.avgCost;
    const currentValue = currentPrice * h.shares;
    const costBasis = h.avgCost * h.shares;
    const pnl = currentValue - costBasis;
    const pnlPct = (pnl / costBasis) * 100;
    return { ...h, currentPrice, currentValue, costBasis, pnl, pnlPct };
  });

  const totalInvested = holdingsWithPnL.reduce((s, h) => s + h.costBasis, 0);
  const totalValue    = holdingsWithPnL.reduce((s, h) => s + h.currentValue, 0);
  const totalPnL      = totalValue - totalInvested;
  const totalPnLPct   = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const totalPortfolio = totalValue + MOCK_CASH;

  const fmt = (n: number) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtC = (n: number) => Math.abs(n) >= 1e6 ? `MK ${(n/1e6).toFixed(2)}M` : `MK ${fmt(n)}`;
  const statusStyle: Record<string, string> = {
    filled:    "bg-green-500/10 text-green-400 border-green-500/20",
    pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    cancelled: "bg-white/5 text-white/30 border-white/10",
  };
  const barColors = ["bg-blue-500","bg-green-500","bg-purple-500","bg-yellow-500","bg-pink-500"];

  return (
    <div className="min-h-screen bg-black text-white pb-16"
      style={{ backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.07) 0%, transparent 60%)" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-12 space-y-8">

        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-blue-400/70 uppercase mb-1">
            {loggedInUser ? `@${loggedInUser}` : "Account"}
          </p>
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Portfolio
          </h1>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Portfolio Value", value: fmtC(totalPortfolio), sub: "Investments + Cash", color: "text-white" },
            { label: "Total P&L",       value: `${totalPnL >= 0 ? "+" : ""}${fmtC(totalPnL)}`, sub: `${totalPnLPct >= 0 ? "+" : ""}${totalPnLPct.toFixed(2)}% all time`, color: totalPnL >= 0 ? "text-green-400" : "text-red-400" },
            { label: "Invested",        value: fmtC(totalValue), sub: `Cost: ${fmtC(totalInvested)}`, color: "text-white" },
            { label: "Cash",            value: fmtC(MOCK_CASH), sub: "Ready to invest", color: "text-blue-300" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{label}</p>
              <p className={`text-xl md:text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/25 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>

        {/* Allocation bar */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">Allocation</p>
          <div className="flex rounded-full overflow-hidden h-3 mb-4">
            {holdingsWithPnL.map((h, i) => (
              <div key={h.ticker} className={`${barColors[i % barColors.length]} transition-all`}
                style={{ width: `${(h.currentValue / totalPortfolio) * 100}%` }} />
            ))}
            <div className="bg-white/20" style={{ width: `${(MOCK_CASH / totalPortfolio) * 100}%` }} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {holdingsWithPnL.map((h, i) => (
              <div key={h.ticker} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${barColors[i % barColors.length]}`} />
                <span className="text-white/40 text-xs">{h.ticker} {((h.currentValue/totalPortfolio)*100).toFixed(1)}%</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-white/40 text-xs">Cash {((MOCK_CASH/totalPortfolio)*100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1 w-fit">
          {(["holdings","orders"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-blue-600 text-white" : "text-white/40 hover:text-white/70"}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "holdings" && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-white/8 text-xs font-bold tracking-widest uppercase text-white/20">
              <span className="col-span-3">Stock</span>
              <span className="col-span-2 text-right">Shares</span>
              <span className="col-span-2 text-right">Avg Cost</span>
              <span className="col-span-2 text-right">Current</span>
              <span className="col-span-3 text-right">P&L</span>
            </div>
            {loadingPrices
              ? [1,2,3,4,5].map(i => <div key={i} className="m-4 h-12 bg-white/5 rounded-lg animate-pulse" />)
              : holdingsWithPnL.map(h => {
                  const info = companyData[h.ticker];
                  return (
                    <div key={h.ticker} onClick={() => router.push(`/pages/${h.ticker}`)}
                      className="grid grid-cols-12 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-all group items-center">
                      <div className="col-span-3">
                        <p className="text-white font-semibold text-sm group-hover:text-blue-200 transition-colors">{h.ticker}</p>
                        <p className="text-white/25 text-xs truncate">{info?.fullName ?? ""}</p>
                      </div>
                      <span className="col-span-2 text-white/70 text-sm text-right">{h.shares.toLocaleString()}</span>
                      <span className="col-span-2 text-white/50 text-sm text-right">MK {fmt(h.avgCost)}</span>
                      <span className="col-span-2 text-white text-sm font-medium text-right">MK {fmt(h.currentPrice)}</span>
                      <div className="col-span-3 text-right">
                        <p className={`text-sm font-bold ${h.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {h.pnl >= 0 ? "+" : ""}{fmtC(h.pnl)}
                        </p>
                        <p className={`text-xs ${h.pnlPct >= 0 ? "text-green-400/70" : "text-red-400/70"}`}>
                          {h.pnlPct >= 0 ? "+" : ""}{h.pnlPct.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })
            }
            {/* Totals row */}
            <div className="grid grid-cols-12 px-6 py-4 bg-white/[0.02] border-t border-white/8 items-center">
              <span className="col-span-3 text-white/40 text-xs uppercase tracking-widest font-bold">Total</span>
              <span className="col-span-4" />
              <span className="col-span-2 text-white/40 text-xs text-right">{fmtC(totalInvested)}</span>
              <div className="col-span-3 text-right">
                <p className={`text-sm font-bold ${totalPnL >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {totalPnL >= 0 ? "+" : ""}{fmtC(totalPnL)}
                </p>
                <p className={`text-xs ${totalPnLPct >= 0 ? "text-green-400/70" : "text-red-400/70"}`}>
                  {totalPnLPct >= 0 ? "+" : ""}{totalPnLPct.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-white/8 text-xs font-bold tracking-widest uppercase text-white/20">
              <span className="col-span-2">Date</span>
              <span className="col-span-2">Stock</span>
              <span className="col-span-2">Type</span>
              <span className="col-span-2 text-right">Shares</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Status</span>
            </div>
            {[...MOCK_ORDERS].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
              <div key={order.id} className="grid grid-cols-12 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all items-center">
                <span className="col-span-2 text-white/30 text-xs">{order.date}</span>
                <span className="col-span-2 text-white text-sm font-semibold cursor-pointer hover:text-blue-300 transition-colors"
                  onClick={() => router.push(`/pages/${order.ticker}`)}>{order.ticker}</span>
                <span className={`col-span-2 text-sm font-bold ${order.type === "buy" ? "text-green-400" : "text-red-400"}`}>
                  {order.type.toUpperCase()}
                </span>
                <span className="col-span-2 text-white/70 text-sm text-right">{order.shares.toLocaleString()}</span>
                <span className="col-span-2 text-white/50 text-sm text-right">MK {fmt(order.price)}</span>
                <div className="col-span-2 flex justify-end">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyle[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Demo notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
          <svg className="w-4 h-4 text-yellow-400/70 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-400/60 text-xs leading-relaxed">
            Portfolio data is currently demo data. Real holdings and orders will populate here once the database is connected.
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
}