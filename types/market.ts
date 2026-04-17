export interface IndexData {
  name: string;
  value: number;
  change: number;
  pct_change: number;
}

export interface IndicesResponse {
  status: string;
  indices: {
    MASI: IndexData;
    DSI: IndexData;
    FSI: IndexData;
  };
}

export interface DividendEntry {
  ticker: string;
  company_name?: string;
  payment_date: string;
  amount_per_share: number;
  dividend_type: string;
  ex_dividend_date: string;
  last_day_to_register: string;
}

export interface DividendsResponse {
  status: string;
  dividends: DividendEntry[];
}

export interface StockData {
  url: string;
  open: string;
  close: string;
  change: number;
  pct_change: number;
  volume: string;
  turnover: string;
}

export interface MarketResponse {
  status: string;
  market: string;
  last_updated: string;
  count: number;
  stocks: Record<string, StockData>;
}

export interface MoverEntry {
  ticker: string;
  change: number;
  volume: number;
  turnover: number;
  close?: number;
}

export interface MoversResponse {
  status: string;
  market: string;
  summary: {
    total_stocks: number;
    gainers: number;
    losers: number;
    unchanged: number;
    total_volume: number;
    total_turnover: number;
  };
  top_gainers: MoverEntry[];
  top_losers: MoverEntry[];
  highest_volume: MoverEntry[];
  highest_turnover: MoverEntry[];
}
