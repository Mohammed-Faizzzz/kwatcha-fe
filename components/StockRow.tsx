interface Props {
  symbol: string;
  price: string;
  change: string;
  volume: string;
}

export default function StockRow({ symbol, price, change, volume }: Props) {
  const changePositive = Number(change) > 0;

  return (
    <div className="group relative bg-white/5 backdrop-blur-lg p-5 rounded-[24px] border border-white/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Ticker Initials */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 font-bold text-white/70 group-hover:text-white ${
          changePositive ? 'bg-emerald-600/20' : 'bg-red-500/20'
        }`}>
          {symbol.substring(0, 2)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{symbol}</h3>
          <p className="text-[11px] text-white/50 font-medium uppercase tracking-widest">MSE • Malawi</p>
        </div>
      </div>

      <div className="text-right flex flex-col items-end">
        <p className="text-lg font-black text-white">
          <span className="text-xs font-medium text-white/50 mr-1">MK</span>
          {Number(price).toLocaleString()}
        </p>
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
          changePositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {change}%
        </span>
      </div>
    </div>
  );
}
