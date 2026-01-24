import Link from 'next/link';
import { Home, BarChart2, Info } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/50 backdrop-blur-lg border border-slate-700 shadow-xl rounded-full px-6 py-3">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {[
          { href: '/', icon: <Home size={24} />, label: 'Market' },
          { href: '/insights', icon: <Info size={24} />, label: 'Insights' },
          { href: '/portfolio', icon: <BarChart2 size={24} />, label: 'Portfolio' },
        ].map(({ href, icon, label }) => (
          <Link key={label} href={href} className="flex flex-col items-center text-white/70 hover:text-blue-400 transition-colors">
            {icon}
            <span className="text-[10px] mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
