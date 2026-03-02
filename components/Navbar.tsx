"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://kwatcha-api.onrender.com/login", {
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
      <nav className="fixed top-0 left-0 w-full backdrop-blur-lg bg-black/50 border-b border-white/10 shadow-lg z-50 px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-white">MSE Trade</div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          {["Market", "Companies", "Insights", "Portfolio"].map((section) => (
            <a
              key={section}
              href={`#${section.toLowerCase()}`}
              className="text-white/70 hover:text-blue-400 transition-colors"
            >
              {section}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={() => { setShowLogin(true); setError(null); }}
            className="border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-sm px-5 rounded-lg transition-all"
          >
            Log In
          </Button>
          <Button
            onClick={() => router.push("/pages/AccountCreationPage")}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 rounded-lg font-semibold transition-all"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Login Modal Overlay */}
      {showLogin && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false); }}
        >
          <div
            className="w-full max-w-sm bg-black border border-white/10 rounded-2xl p-8 shadow-2xl"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.1) 0%, transparent 70%)",
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-blue-400/70 uppercase mb-1">
                  MSE Trade
                </p>
                <h2
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Welcome back
                </h2>
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

            {/* Fields */}
            <div className="space-y-4">
              {/* Username */}
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
                    className={`w-full bg-white/5 border rounded-lg pl-8 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${
                      error ? "border-red-500/50 focus:border-red-400" : "border-white/10 focus:border-blue-500/60"
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
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
                    className={`w-full bg-white/5 border rounded-lg px-4 py-2.5 pr-10 text-white text-sm placeholder-white/20 focus:outline-none focus:bg-white/8 transition-all ${
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

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* Submit */}
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

            {/* Footer */}
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