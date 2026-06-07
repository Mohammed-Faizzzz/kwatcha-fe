"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ExternalLink, ChevronDown } from "lucide-react";
import { API_BASE } from "@/lib/constants";

interface Source {
  title: string;
  url?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
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
      console.error("[ChatBot] fetch error:", detail);
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

  const SUGGESTIONS = [
    "What are today's top gainers?",
    "Tell me about TNM stock",
    "What is the MASI index?",
  ];

  return (
    <>
      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 z-[90] flex flex-col"
          style={{
            width: "min(calc(100vw - 32px), 380px)",
            height: "min(calc(100vh - 120px), 560px)",
            background: "#060a10",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(59,130,246,0.06)",
            backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.09) 0%, transparent 60%)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(37,99,235,0.18)",
                  border: "0.5px solid rgba(37,99,235,0.3)",
                }}
              >
                <MessageSquare size={13} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Market Assistant</p>
                <p className="text-white/30 text-xs leading-tight">MSE stocks &amp; insights</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/30 hover:text-white/60 transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Minimise chat"
            >
              <ChevronDown size={17} />
            </button>
          </div>

          {/* Message list */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(37,99,235,0.1)",
                    border: "0.5px solid rgba(37,99,235,0.18)",
                  }}
                >
                  <MessageSquare size={22} className="text-blue-400/60" />
                </div>
                <div className="text-center">
                  <p className="text-white/55 text-sm font-medium">How can I help?</p>
                  <p className="text-white/25 text-xs mt-1 leading-relaxed">
                    Ask about listed stocks, prices, or company insights
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setInput(s);
                        inputRef.current?.focus();
                      }}
                      className="text-left px-3 py-2 rounded-xl text-white/40 text-xs transition-all hover:text-white/70 hover:bg-white/[0.04]"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "0.5px solid rgba(255,255,255,0.07)",
                      }}
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
                    className="max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed"
                    style={
                      msg.role === "user"
                        ? {
                            background: "rgb(37,99,235)",
                            color: "#fff",
                            borderRadius: "16px",
                            borderBottomRightRadius: "5px",
                          }
                        : {
                            background: "rgba(255,255,255,0.04)",
                            border: "0.5px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.82)",
                            borderRadius: "16px",
                            borderBottomLeftRadius: "5px",
                          }
                    }
                  >
                    {msg.content}
                    {msg.sources && msg.sources.length > 0 && (
                      <div
                        className="mt-2.5 pt-2 flex flex-col gap-1.5"
                        style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}
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
                              <ExternalLink size={10} className="flex-shrink-0" />
                              {src.title}
                            </a>
                          ) : (
                            <span key={j} className="flex items-center gap-1.5 text-xs text-white/35">
                              <ExternalLink size={10} className="flex-shrink-0 opacity-50" />
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

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="px-3.5 py-3 flex gap-1.5 items-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
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

          {/* Input */}
          <div
            className="px-3 pb-3 pt-2 flex-shrink-0"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="flex items-end gap-2 rounded-xl px-3 py-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.09)",
              }}
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
                style={{ maxHeight: "80px", minHeight: "22px" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:cursor-not-allowed"
                style={{
                  background:
                    input.trim() && !loading ? "rgb(37,99,235)" : "rgba(255,255,255,0.06)",
                }}
                aria-label="Send message"
              >
                <Send
                  size={13}
                  className={input.trim() && !loading ? "text-white" : "text-white/25"}
                />
              </button>
            </div>
            <p className="text-center text-white/15 text-[10px] mt-1.5">
              Enter to send · Shift+Enter for newline
            </p>
          </div>
        </div>
      )}

      {/* ── Floating bubble ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-[90] w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          background: isOpen ? "rgba(255,255,255,0.07)" : "rgb(37,99,235)",
          border: isOpen ? "0.5px solid rgba(255,255,255,0.14)" : "none",
          boxShadow: isOpen ? "none" : "0 4px 20px rgba(37,99,235,0.5)",
        }}
        aria-label={isOpen ? "Close chat" : "Open Market Assistant"}
      >
        {isOpen ? (
          <X size={17} className="text-white/70" />
        ) : (
          <MessageSquare size={17} className="text-white" />
        )}
      </button>
    </>
  );
}
