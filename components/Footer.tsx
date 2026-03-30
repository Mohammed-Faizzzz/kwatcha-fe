// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <>
      {/* Spacer so fixed footer doesn't overlap content on mobile */}
      <div className="h-[72px] md:hidden" aria-hidden="true" />
      <footer className="fixed bottom-0 left-0 w-full md:static md:bottom-auto backdrop-blur-lg bg-black/50 border-t border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} Msika Wa Kampani</p>
          <p className="mt-2 md:mt-0">Data from Malawi Stock Exchange</p>
        </div>
      </footer>
    </>
  );
}
