export interface Trade {
  timestamp: string;
  symbol: string;
  position: 'Long' | 'Short' | 'None';
  entryPrice: number;
  closePrice: number;
  pnlPercentage: number;
  cumulativeROI: number;
  accountValue: number;
}

export interface TradingMetrics {
  accountValue: number;
  totalTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  sharpeRatio: number;
  stopLoss: number;
}

export interface TradingData {
  trades: Trade[];
  metrics: TradingMetrics;
}

export interface SheetResponse {
  range: string;
  majorDimension: string;
  values: any[][];
}