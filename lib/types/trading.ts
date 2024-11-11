export interface Trade {
  timestamp: string;
  symbol: string;
  closePrice: number;
  position: 'Long' | 'Short' | 'None';
  entryPrice: number;
  pnlPercentage: number;
  cumulativeROI: number;
  accountValue: number;
  equity: number;
  drawdown: number;
  profitFactor: number;
  sharpeRatio: number;
}

export interface TradingMetrics {
  winRate: number;
  totalTrades: number;
  accountValue: number;
  stopLoss: number;
  largestWin: number;
  largestLoss: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  sharpeRatio: number;
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