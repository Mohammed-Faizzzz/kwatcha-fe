// types/market.ts
export interface StockData {
  url: string;
  open: string;
  close: string;
  change: string;
  volume: string;
  turnover: string;
}

export interface MSEApiResponse {
  status: string;
  market: string;
  last_updated: string;
  count: number;
  stocks: Record<string, StockData>;
}