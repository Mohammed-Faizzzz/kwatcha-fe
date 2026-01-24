// components/StockDetail.tsx
import { StockData } from '@/types/market';

export default function StockDetail({ ticker, data, onClose }: { ticker: string, data: StockData, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-white p-6 animate-in slide-in-from-bottom">
      <button onClick={onClose} className="text-blue-600 font-bold mb-6">← Back to Market</button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">{ticker}</h2>
        <p className="text-slate-400 text-sm">Malawi Stock Exchange</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Metric label="Last Close" value={`MK ${Number(data.close).toLocaleString()}`} />
        <Metric label="Opening" value={`MK ${Number(data.open).toLocaleString()}`} />
        <Metric label="Volume" value={Number(data.volume).toLocaleString()} />
        <Metric label="Turnover" value={`MK ${Number(data.turnover).toLocaleString()}`} />
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
        <h3 className="font-bold text-blue-900 mb-2">Company Insights</h3>
        <p className="text-blue-800/80 text-sm leading-relaxed">
          {ticker} is showing a volume of {data.volume}. 
          Visit the official MSE page for more: 
          <a href={data.url} target="_blank" className="block mt-2 underline text-blue-900 font-medium">Official Company Profile</a>
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}