"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, ArrowRight, TrendingUp, Shield, BarChart3, Users } from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: <TrendingUp size={20} className="text-blue-400" />,
      title: "Accessibility",
      body: "We believe every Malawian deserves access to investment tools that were once reserved for institutions and the wealthy.",
    },
    {
      icon: <Shield size={20} className="text-blue-400" />,
      title: "Transparency",
      body: "Real-time data, clear pricing, and no hidden fees. You always know exactly where your money is and how it's performing.",
    },
    {
      icon: <BarChart3 size={20} className="text-blue-400" />,
      title: "Informed Decisions",
      body: "From price history to company financials, we give you the research tools to invest with confidence — not guesswork.",
    },
    {
      icon: <Users size={20} className="text-blue-400" />,
      title: "Local First",
      body: "Built in Malawi, for Malawi. We understand the local market and are committed to growing the MSE ecosystem.",
    },
  ];

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(29,78,216,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(14,165,233,0.05) 0%, transparent 60%)",
      }}
    >
      <Navbar />

      {/* ── Hero ── */}
      <section className="px-4 md:px-6 pt-40 pb-20 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-blue-500/40" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase">
              About Us
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-5">
            Investing in Malawi,{" "}
            <span className="text-white/28 font-semibold">made simple.</span>
          </h1>
          <p className="text-white/45 text-[15px] max-w-xl leading-relaxed">
            Msika wa Kampani is a modern trading and market-data platform built on top of the Malawi Stock Exchange.
            Our goal is to make it straightforward for any Malawian — at home or in the diaspora — to track,
            research, and invest in the companies shaping the country's future.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase mb-3">Our Mission</p>
            <p className="text-white/70 text-[15px] leading-relaxed">
              To democratise access to the Malawi Stock Exchange by providing a fast, transparent, and
              intuitive platform that empowers individuals to participate in Malawi's economic growth.
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
            <p className="text-[10px] font-bold tracking-[0.2em] text-blue-400/70 uppercase mb-3">Our Vision</p>
            <p className="text-white/70 text-[15px] leading-relaxed">
              A Malawi where every citizen can meaningfully participate in capital markets — building personal
              wealth while contributing to the growth of the businesses and institutions that define the nation.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/20" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400/80 px-2">
            What We Stand For
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <p className="text-white font-semibold mb-2">{v.title}</p>
              <p className="text-white/40 text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 md:px-6 pb-20 max-w-7xl mx-auto">
        <div
          className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(29,78,216,0.12) 0%, rgba(14,165,233,0.06) 100%)",
            border: "1px solid rgba(59,130,246,0.15)",
          }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to start investing?</h2>
            <p className="text-white/40 text-sm">Open a CSD account and start trading on the MSE today.</p>
          </div>
          <button
            onClick={() => router.push("/pages/AccountCreationPage")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3 rounded-xl transition-all shrink-0"
          >
            Get started <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="px-4 md:px-6 pb-28 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-500/20" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400/80 px-2">
            Get In Touch
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-500/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="mailto:hello@msikawakampani.mw"
            className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
              <Mail size={18} className="text-blue-400" />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Email</p>
            <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
              hello@msikawakampani.mw
            </p>
          </a>

          <a
            href="tel:+265993000000"
            className="group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-blue-500/30 hover:bg-white/[0.05] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
              <Phone size={18} className="text-blue-400" />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Phone</p>
            <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
              +265 993 000 000
            </p>
          </a>

          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center mb-4">
              <MapPin size={18} className="text-blue-400" />
            </div>
            <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Address</p>
            <p className="text-white font-medium">City Centre</p>
            <p className="text-white/40 text-sm">Lilongwe, Malawi</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
