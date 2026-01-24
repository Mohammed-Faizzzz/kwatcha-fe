import React from "react";
import { ArrowRight, TrendingUp, BarChart3, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen pb-24">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div className="text-xl font-bold">MSE Trade</div>
        <div className="flex gap-6 text-sm font-medium text-slate-600">
          <a href="#market" className="hover:text-black">Market</a>
          <a href="#companies" className="hover:text-black">Companies</a>
          <a href="#insights" className="hover:text-black">Insights</a>
          <a href="#portfolio" className="hover:text-black">Portfolio</a>
        </div>
        <Button>Get Started</Button>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Invest in Malawi’s Stock Market
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          Track prices, analyze companies, and understand the Malawi Stock Exchange — all in one clean, modern platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="gap-2">
            Explore Market <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline">
            View Companies
          </Button>
        </div>
      </section>

      {/* Market Snapshot */}
      <section id="market" className="px-8 pb-20 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Market Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <TrendingUp className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Market Status</p>
              <p className="text-xl font-semibold">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <BarChart3 className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Total Turnover</p>
              <p className="text-xl font-semibold">MK 1.2B</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Building2 className="mb-4 text-slate-600" />
              <p className="text-sm text-slate-500">Listed Companies</p>
              <p className="text-xl font-semibold">16</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Companies Preview */}
      <section id="companies" className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular Companies</h2>
          <a href="/market" className="text-sm font-medium text-blue-600">View all →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["FDH Bank", "Airtel Malawi", "NBM", "Illovo", "FMBCH", "BHL"].map((name) => (
            <Card key={name} className="hover:shadow-md transition">
              <CardContent className="p-6">
                <p className="text-sm text-slate-500">MSE</p>
                <p className="text-lg font-semibold mt-1">{name}</p>
                <p className="text-sm text-slate-600 mt-2">MK —</p>
                <Button variant="link" className="px-0 mt-4">View details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-8 py-6 flex justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MSE Trade</p>
          <p>Data from Malawi Stock Exchange</p>
        </div>
      </footer>
    </div>
  );
}
