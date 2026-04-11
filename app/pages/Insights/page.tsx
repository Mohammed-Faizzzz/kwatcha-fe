"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpRight, Newspaper, Bell, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { companyData } from "@/lib/companyData";
import { apiFetch } from "@/lib/apiFetch";
import { API_BASE } from "@/lib/constants";

interface ArticleEntry {
  ticker: string;
  fullName: string;
  sector: string;
  title: string;
  date: string;
  url: string;
}

interface UpdateEntry {
  ticker: string;
  fullName: string;
  sector: string;
  title: string;
  date: string;
  type: string;
}

const UPDATE_TYPE_COLORS: Record<string, string> = {
  Dividend: "bg-green-500/10 text-green-400 border-green-500/15",
  "Corporate Change": "bg-blue-500/10 text-blue-400 border-blue-500/15",
  Results: "bg-purple-500/10 text-purple-400 border-purple-500/15",
  AGM: "bg-yellow-500/10 text-yellow-400/80 border-yellow-500/15",
};

function typeColor(type: string) {
  return UPDATE_TYPE_COLORS[type] ?? "bg-t-input text-t-fg40 border-t-linei";
}

function buildData() {
  const articles: ArticleEntry[] = [];
  const updates: UpdateEntry[] = [];

  for (const [ticker, company] of Object.entries(companyData)) {
    for (const a of company.articles) {
      articles.push({ ticker, fullName: company.fullName, sector: company.sector, ...a });
    }
    for (const u of company.tradingUpdates) {
      updates.push({ ticker, fullName: company.fullName, sector: company.sector, ...u });
    }
  }

  articles.sort((a, b) => b.date.localeCompare(a.date));
  updates.sort((a, b) => b.date.localeCompare(a.date));

  return { articles, updates };
}

const { articles: ALL_ARTICLES, updates: ALL_UPDATES } = buildData();

const UPDATE_TYPES = ["All", ...Array.from(new Set(ALL_UPDATES.map((u) => u.type))).sort()];

export default function InsightsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"news" | "updates">("news");
  const [updateType, setUpdateType] = useState("All");
  const [search, setSearch] = useState("");
  const [tickerItems, setTickerItems] = useState<{ symbol: string; price: string; change: number }[]>([]);

  useEffect(() => {
    apiFetch<{ stocks: Record<string, { close: string | number; pct_change?: number }> }>(
      `${API_BASE}/stocks`
    ).then(data => {
      setTickerItems(
        Object.entries(data.stocks).map(([name, d]) => ({
          symbol: name,
          price: Number(d.close).toLocaleString(),
          change: parseFloat(((d.pct_change ?? 0) * 100).toFixed(2)),
        }))
      );
    }).catch(() => {});
  }, []);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return ALL_ARTICLES;
    const q = search.trim().toLowerCase();
    return ALL_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.ticker.toLowerCase().includes(q) ||
        a.fullName.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredUpdates = useMemo(() => {
    let items = updateType === "All" ? ALL_UPDATES : ALL_UPDATES.filter((u) => u.type === updateType);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (u) =>
          u.title.toLowerCase().includes(q) ||
          u.ticker.toLowerCase().includes(q) ||
          u.fullName.toLowerCase().includes(q)
      );
    }
    return items;
  }, [search, updateType]);

  return (
    <div
      className="min-h-screen bg-t-bg text-t-fg"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, var(--t-grad1) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, var(--t-grad2) 0%, transparent 60%)",
      }}
    >
      <Navbar tickerItems={tickerItems} />

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-44 pb-28">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              Msika wa Kampani
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-t-fg mb-3">Market Insights</h1>
          <p className="text-t-fg40 text-sm">
            Latest news, trading updates, and announcements from MSE-listed companies.
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="bg-t-card border border-t-line rounded-2xl px-6 py-4 flex items-center gap-4">
            <Newspaper size={18} className="text-blue-400/50" />
            <div>
              <p className="text-t-fg30 text-xs uppercase tracking-widest">News Articles</p>
              <p className="text-2xl font-bold text-t-fg">{ALL_ARTICLES.length}</p>
            </div>
          </div>
          <div className="bg-t-card border border-t-line rounded-2xl px-6 py-4 flex items-center gap-4">
            <Bell size={18} className="text-blue-400/50" />
            <div>
              <p className="text-t-fg30 text-xs uppercase tracking-widest">Trading Updates</p>
              <p className="text-2xl font-bold text-t-fg">{ALL_UPDATES.length}</p>
            </div>
          </div>
        </div>

        {/* Tab bar + search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1 bg-t-input rounded-xl p-1">
            <button
              onClick={() => setTab("news")}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                tab === "news" ? "bg-t-hover text-t-fg" : "text-t-fg30 hover:text-t-fg60"
              }`}
            >
              <Newspaper size={12} /> News
            </button>
            <button
              onClick={() => setTab("updates")}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                tab === "updates" ? "bg-t-hover text-t-fg" : "text-t-fg30 hover:text-t-fg60"
              }`}
            >
              <Bell size={12} /> Updates
            </button>
          </div>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-t-input border border-t-line rounded-xl px-4 py-2 text-sm text-t-fg placeholder:text-t-fg20 focus:outline-none focus:border-blue-500/40 transition-colors w-48"
          />
        </div>

        {/* Update type filters */}
        {tab === "updates" && (
          <div className="flex flex-wrap gap-2 mb-6">
            {UPDATE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setUpdateType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  updateType === t
                    ? "bg-blue-600/30 border-blue-500/40 text-blue-300"
                    : "bg-t-input border-t-line text-t-fg40 hover:text-t-fg70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* News feed */}
        {tab === "news" && (
          <div className="space-y-3">
            {filteredArticles.length === 0 ? (
              <p className="text-t-fg20 text-sm text-center py-16">No articles found.</p>
            ) : (
              filteredArticles.map((a, i) => (
                <a
                  key={i}
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 bg-t-card border border-t-line hover:border-blue-500/25 hover:bg-t-hover rounded-2xl p-5 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <button
                        onClick={(e) => { e.preventDefault(); router.push(`/pages/${a.ticker}`); }}
                        className="text-xs font-bold text-blue-400/70 hover:text-blue-400 transition-colors tracking-widest uppercase"
                      >
                        {a.ticker}
                      </button>
                      <span className="text-t-fg15 text-xs">·</span>
                      <span className="text-t-fg25 text-xs">{a.sector}</span>
                    </div>
                    <p className="text-t-fg80 text-sm font-semibold group-hover:text-t-fg transition-colors leading-snug">
                      {a.title}
                    </p>
                    <p className="text-t-fg25 text-xs mt-1.5">
                      {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <ArrowUpRight size={16} className="text-t-fg20 group-hover:text-blue-400/60 transition-colors flex-shrink-0 mt-1" />
                </a>
              ))
            )}
          </div>
        )}

        {/* Updates feed */}
        {tab === "updates" && (
          <div className="space-y-3">
            {filteredUpdates.length === 0 ? (
              <p className="text-t-fg20 text-sm text-center py-16">No updates found.</p>
            ) : (
              filteredUpdates.map((u, i) => (
                <div
                  key={i}
                  onClick={() => router.push(`/pages/${u.ticker}`)}
                  className="group flex items-start justify-between gap-4 bg-t-card border border-t-line hover:border-blue-500/25 hover:bg-t-hover rounded-2xl p-5 transition-all cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-blue-400/70 tracking-widest uppercase">
                        {u.ticker}
                      </span>
                      <span className="text-t-fg15 text-xs">·</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColor(u.type)}`}>
                        {u.type}
                      </span>
                    </div>
                    <p className="text-t-fg80 text-sm font-semibold group-hover:text-t-fg transition-colors leading-snug">
                      {u.title}
                    </p>
                    <p className="text-t-fg25 text-xs mt-1.5">
                      {new Date(u.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-t-fg20 group-hover:text-blue-400/60 transition-colors flex-shrink-0 mt-1" />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
