export interface StockData {
  url: string;
  open: string;
  close: string;
  change: string;
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
