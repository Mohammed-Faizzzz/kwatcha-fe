"use client";

import { useState, useEffect, useRef } from "react";
import { Send, ExternalLink, MessageSquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/constants";
import { useTheme } from "@/components/ThemeProvider";

interface Source {
  title: string;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGGESTIONS = [
  "What are today's top gainers?",
  "Tell me about TNM stock",
  "What is the MASI index?",
  "Which stocks have upcoming dividends?",
];

export default function AssistantPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggBg      = isDark ? "rgba(255,255,255,0.03)"  : "rgba(15,23,42,0.04)";
  const suggBgHov   = isDark ? "rgba(255,255,255,0.055)" : "rgba(15,23,42,0.08)";
  const suggBorder  = isDark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(15,23,42,0.09)";
  const asstBg      = isDark ? "rgba(255,255,255,0.04)"  : "rgba(15,23,42,0.045)";
  const asstBorder  = isDark ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid rgba(15,23,42,0.1)";
  const asstColor   = isDark ? "rgba(255,255,255,0.82)"  : "rgba(15,23,42,0.85)";
  const srcDivider  = isDark ? "0.5px solid rgba(255,255,255,0.1)"  : "0.5px solid rgba(15,23,42,0.1)";
  const inputBarBg  = isDark ? "rgba(255,255,255,0.04)"  : "rgba(15,23,42,0.045)";
  const inputBarBdr = isDark ? "0.5px solid rgba(255,255,255,0.1)"  : "0.5px solid rgba(15,23,42,0.1)";
  const sendInact   = isDark ? "rgba(255,255,255,0.06)"  : "rgba(15,23,42,0.07)";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    text = text.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}${errBody ? `: ${errBody}` : ""}`);
      }

      const data = await res.json();
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: data.response || data.message || "No response received.",
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[Assistant] fetch error:", detail);
      setMessages([
        ...updated,
        { role: "assistant", content: `Error: ${detail}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <main
        className="flex-1 flex flex-col mx-auto w-full max-w-2xl px-4 pt-32 pb-6"
        style={{ minHeight: 0 }}
      >
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
            Msika Wa Kampani
          </p>
          <h1 className="text-3xl font-bold text-white">
            Market Assistant
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Ask anything about MSE-listed stocks, indices, or company insights
          </p>
        </div>

        {/* Message area */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4" style={{ scrollbarWidth: "none" }}>
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 py-12">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(37,99,235,0.1)",
                  border: "0.5px solid rgba(37,99,235,0.2)",
                }}
              >
                <MessageSquare size={28} className="text-blue-400/70" />
              </div>
              <div className="text-center">
                <p className="text-white/50 text-base font-medium">How can I help?</p>
                <p className="text-white/25 text-sm mt-1">
                  Try one of these to get started
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 rounded-xl text-white/45 text-sm transition-all hover:text-white/75"
                    style={{ background: suggBg, border: suggBorder }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = suggBgHov)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = suggBg)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] px-4 py-3 text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "rgb(37,99,235)",
                          color: "#fff",
                          borderRadius: "18px",
                          borderBottomRightRadius: "5px",
                        }
                      : {
                          background: asstBg,
                          border: asstBorder,
                          color: asstColor,
                          borderRadius: "18px",
                          borderBottomLeftRadius: "5px",
                        }
                  }
                >
                  {msg.content}
                  {msg.sources && msg.sources.length > 0 && (
                    <div
                      className="mt-3 pt-3 flex flex-col gap-1.5"
                      style={{ borderTop: srcDivider }}
                    >
                      <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                        Sources
                      </p>
                      {msg.sources.map((src, j) =>
                        src.url ? (
                          <a
                            key={j}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-400/80 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink size={11} className="flex-shrink-0" />
                            {src.title}
                          </a>
                        ) : (
                          <span key={j} className="flex items-center gap-1.5 text-xs text-white/35">
                            <ExternalLink size={11} className="flex-shrink-0 opacity-50" />
                            {src.title}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3.5 flex gap-1.5 items-center"
                style={{
                  background: asstBg,
                  border: asstBorder,
                  borderRadius: "18px",
                  borderBottomLeftRadius: "5px",
                }}
              >
                {[0, 1, 2].map((k) => (
                  <span
                    key={k}
                    className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                    style={{ animationDelay: `${k * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div
          className="flex-shrink-0 mt-4 rounded-2xl px-4 py-3 flex items-end gap-3"
          style={{ background: inputBarBg, border: inputBarBdr }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about MSE stocks…"
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-white text-sm placeholder-white/20 resize-none outline-none leading-relaxed disabled:opacity-50"
            style={{ maxHeight: "120px", minHeight: "22px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed mb-0.5"
            style={{
              background: input.trim() && !loading ? "rgb(37,99,235)" : sendInact,
            }}
            aria-label="Send"
          >
            <Send size={14} className={input.trim() && !loading ? "text-white" : "text-white/25"} />
          </button>
        </div>
        <p className="text-center text-white/15 text-[10px] mt-2">
          Enter to send · Shift+Enter for newline
        </p>
      </main>

      <Footer />
    </div>
  );
}
