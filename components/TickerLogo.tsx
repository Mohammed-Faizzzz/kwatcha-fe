"use client";
import { useState } from "react";
import Image from "next/image";

interface TickerLogoProps {
  ticker: string;
  size?: number;
  className?: string;
}

const LOGO_FILES: Record<string, string> = {
  AIRTEL:   "AIRTEL.webp",
  BHL:      "BHL.png",
  FDHB:     "FDHB.png",
  FMB:      "FMB.png",
  FMBCH:    "FMBCH.webp",
  ICON:     "ICON.png",
  ILLOVO:   "ILLOVO.png",
  MPICO:    "MPICO.png",
  NBM:      "NBM.webp",
  NBS:      "NBS.webp",
  NICO:     "NICO.png",
  NITL:     "NITL.png",
  OML:      "OML.webp",
  OMU:      "OMU.webp",
  PCL:      "PCL.webp",
  STNBIC:   "STANDARD.webp",
  STANDARD: "STANDARD.webp",
  SUNBRD:   "SUNBIRD.webp",
  SUNBIRD:  "SUNBIRD.webp",
  TNM:      "TNM.webp",
};

export default function TickerLogo({ ticker, size = 32, className = "" }: TickerLogoProps) {
  const [failed, setFailed] = useState(false);

  const file = LOGO_FILES[ticker];

  if (failed || !file) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-white/8 text-white/50 font-bold shrink-0 text-[10px] ${className}`}
        style={{ width: size, height: size }}
      >
        {ticker.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image
        src={`/logos/${file}`}
        alt={`${ticker} logo`}
        fill
        className="object-contain"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  );
}
