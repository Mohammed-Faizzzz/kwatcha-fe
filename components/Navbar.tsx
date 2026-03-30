"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/constants";

interface NavbarProps {
  tickerItems?: { symbol: string; price: string; change: number }[];
}

export default function Navbar({ tickerItems = [] }: NavbarProps) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mse_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.loggedIn) setLoggedInUser(parsed.username);
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("mse_user");
    setLoggedInUser(null);
    router.push("/");
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || data?.error || "Invalid username or password.");
      }
      setShowLogin(false);
      setUsername("");
      setPassword("");
      localStorage.setItem("mse_user", JSON.stringify({ username, loggedIn: true }));
      setLoggedInUser(username);
      router.push("/pages/DashboardPage");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
    if (e.key === "Escape") setShowLogin(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">

        {/* ── Full-width fixed nav ── */}
        <nav
          className="flex items-center justify-between px-4 md:px-12 py-4 md:py-5"
          style={{
            background: "rgba(6,10,16,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "9px", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <Image
              src="/MWK_logo.jpeg"
              alt="MWK Logo"
              width={38}
              height={38}
              style={{ borderRadius: "50%" }}
            />
            <span style={{ fontSize: "17px", fontWeight: 500, color: "#fff", letterSpacing: "0.01em" }}>
              Msika{" "}
              <span style={{ color: "rgba(255,255,255,0.3)" }}>wa Kampani</span>
            </span>
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex" style={{ gap: "4px" }}>
            {["Market", "Companies", "Insights", ...(loggedInUser ? ["Portfolio"] : [])].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => router.push(`/pages/${section}`)}
                  onMouseEnter={() => setHoveredNav(section)}
                  onMouseLeave={() => setHoveredNav(null)}
                  style={{
                    position: "relative",
                    fontSize: "15px",
                    color: hoveredNav === section ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.45)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "7px 14px",
                    borderRadius: "8px",
                    transition: "color 0.18s",
                  }}
                >
                  {section}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      left: 0,
                      width: hoveredNav === section ? "100%" : "0%",
                      height: "1.5px",
                      background: "rgba(99,155,255,0.7)",
                      borderRadius: "2px",
                      transition: "width 0.25s ease",
                    }}
                  />
                </button>
              )
            )}
          </div>

          {/* Right side — hidden on mobile */}
          <div className="hidden md:flex items-center" style={{ gap: "10px" }}>
            {/* Market open pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "0.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "999px",
                padding: "6px 14px",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex", width: "7px", height: "7px" }}>
                <span
                  className="animate-ping"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "#22c55e",
                    opacity: 0.4,
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
              </span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#4ade80" }}>Open</span>
            </div>

            {loggedInUser ? (
              <>
                <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)" }}>
                  @{loggedInUser}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#fff",
                    background: "rgb(220,38,38)",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setShowLogin(true); setError(null); }}
                  style={{
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.05)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    padding: "9px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  Log in
                </button>
                <button
                  onClick={() => router.push("/pages/AccountCreationPage")}
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#fff",
                    background: "rgb(37,99,235)",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgb(59,130,246)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgb(37,99,235)")}
                >
                  Get started
                </button>
              </>
            )}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* ── Mobile dropdown menu ── */}
        {menuOpen && (
          <div
            className="md:hidden flex flex-col px-4 py-4 gap-1"
            style={{
              background: "rgba(6,10,16,0.98)",
              borderBottom: "0.5px solid rgba(255,255,255,0.08)",
            }}
          >
            {["Market", "Companies", "Insights", ...(loggedInUser ? ["Portfolio"] : [])].map((section) => (
              <button
                key={section}
                onClick={() => { router.push(`/pages/${section}`); setMenuOpen(false); }}
                className="text-left px-3 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-[15px]"
              >
                {section}
              </button>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3" style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
              {loggedInUser ? (
                <>
                  <span className="text-white/40 text-sm px-3">@{loggedInUser}</span>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="w-full text-white font-medium py-2.5 rounded-lg text-[15px]"
                    style={{ background: "rgb(220,38,38)" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLogin(true); setError(null); setMenuOpen(false); }}
                    className="w-full text-white/70 py-2.5 rounded-lg text-[15px]"
                    style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => { router.push("/pages/AccountCreationPage"); setMenuOpen(false); }}
                    className="w-full text-white font-medium py-2.5 rounded-lg text-[15px]"
                    style={{ background: "rgb(37,99,235)" }}
                  >
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
                {/* ── Ticker strip ── */}
        {tickerItems.length > 0 && (
          <div style={{
            overflow: "hidden",
            background: "rgba(6,10,16,0.97)",
            borderBottom: "0.5px solid rgba(59,130,246,0.12)",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
          >
            <div
              style={{
                display: "flex",
                whiteSpace: "nowrap",
                width: "max-content",
                animation: "ticker 45s linear infinite",
              }}
            >
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "0 28px",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    {item.symbol}
                  </span>
                  MK {item.price}
                  <span
                    style={{
                      color:
                        item.change > 0
                          ? "#4ade80"
                          : item.change < 0
                          ? "#f87171"
                          : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: "rgba(59,130,246,0.3)",
                      marginLeft: "10px",
                      flexShrink: 0,
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Login Modal ── */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-8 shadow-2xl"
            style={{
              background: "#000",
              border: "0.5px solid rgba(255,255,255,0.1)",
              backgroundImage:
                "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.1) 0%, transparent 70%)",
            }}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
                  Msika Wa Kampani
                </p>
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="text-white/40 text-sm mt-1">Sign in to your trading account</p>
              </div>
              <button
                onClick={() => setShowLogin(false)}
                className="text-white/30 hover:text-white/60 transition-colors mt-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm select-none">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(null); }}
                    placeholder="your_username"
                    autoFocus
                    className={`w-full bg-white/5 border rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none transition-all ${
                      error ? "border-red-500/50 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-widest text-blue-300/80 uppercase">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="••••••••"
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none transition-all ${
                      error ? "border-red-500/50 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : "Sign In"}
              </Button>
            </div>

            <div className="mt-6 pt-5 border-t border-white/8 text-center">
              <p className="text-white/30 text-xs">
                Don't have an account?{" "}
                <button
                  onClick={() => { setShowLogin(false); router.push("/pages/AccountCreationPage"); }}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Apply here
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}