// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer className="backdrop-blur-lg bg-black/50 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
        <p>© {new Date().getFullYear()} Msika Wa Kampani</p>
        <p className="mt-2 md:mt-0">Data from Malawi Stock Exchange</p>
      </div>
    </footer>
  );
}
