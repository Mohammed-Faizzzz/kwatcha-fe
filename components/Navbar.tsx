// components/Navbar.tsx
import Link from 'next/link';
import { Home, BarChart2, Info } from 'lucide-react'; // npm i lucide-react

export default function Navbar() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-full px-6 py-3">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center text-slate-600 hover:text-blue-600">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Market</span>
        </Link>
        <Link href="/insights" className="flex flex-col items-center text-slate-600 hover:text-blue-600">
          <Info size={24} />
          <span className="text-[10px] mt-1 font-medium">Insights</span>
        </Link>
        <Link href="/portfolio" className="flex flex-col items-center text-slate-600 hover:text-blue-600">
          <BarChart2 size={24} />
          <span className="text-[10px] mt-1 font-medium">Portfolio</span>
        </Link>
      </div>
    </nav>
  );
}