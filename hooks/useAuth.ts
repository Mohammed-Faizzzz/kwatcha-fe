"use client";
import { useEffect, useState } from "react";

const AUTH_KEY = "mse_user";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.loggedIn) setUsername(parsed.username);
      } catch {}
    }
    setLoaded(true);
  }, []);

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUsername(null);
  };

  return { username, logout, loaded };
}
