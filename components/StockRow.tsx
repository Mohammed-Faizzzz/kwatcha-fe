// components/StockRow.tsx
interface StockRowProps {
  symbol: string;
  price: string;
  change: string;
  volume: string;
}

export default function StockRow({ symbol, price, change, volume }: StockRowProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col">
        <span className="font-bold text-slate-800 text-lg">{symbol}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Vol: {Number(volume).toLocaleString()}
        </span>
      </div>
      <div className="text-right">
        <div className="text-md font-bold text-slate-900">MK {Number(price).toLocaleString()}</div>
        <div className={`text-xs font-bold ${Number(change) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {change === "0" ? "0.00%" : `${change}%`}
        </div>
      </div>
    </div>
  );
}