import { Trade, TradingMetrics } from "@/lib/types/trading";

export function parseTradeRow(row: string[]): Trade {
  // Match your Google Sheets column structure
  const [
    timestamp,
    price,
    position,
    closePrice,
    pnl,
    accountValue,
    leverage,
    tradeNumber,
    equity,
    baseValue,
    drawdown,
    maxDrawdown,
    currentDrawdown,
    profitFactor,
    sharpeRatio
  ] = row;

  const parsedPnl = parseFloat(pnl) || 0;
  const parsedAccountValue = parseFloat(accountValue) || 0;
  const initialAccountValue = 14.58; // Starting account value
  const cumulativeROI = ((parsedAccountValue - initialAccountValue) / initialAccountValue) * 100;

  return {
    timestamp: new Date(timestamp).toISOString(),
    symbol: 'SOL',  // Hardcoded for now since all trades are SOL
    position: position as 'Long' | 'Short' | 'None',
    entryPrice: parseFloat(price) || 0,
    closePrice: parseFloat(closePrice) || 0,
    pnlPercentage: parsedPnl,
    cumulativeROI: cumulativeROI,
    accountValue: parsedAccountValue,
    equity: parseFloat(equity) || 0,
    drawdown: parseFloat(drawdown) || 0,
    profitFactor: parseFloat(profitFactor) || 0,
    sharpeRatio: parseFloat(sharpeRatio) || 0
  };
}

export function calculateMetrics(trades: Trade[]): TradingMetrics {
  if (!trades.length) return getEmptyMetrics();

  const lastTrade = trades[trades.length - 1];
  const winningTrades = trades.filter(t => t.pnlPercentage > 0);
  
  return {
    winRate: (winningTrades.length / trades.length) * 100,
    totalTrades: trades.length,
    accountValue: lastTrade.accountValue,
    stopLoss: 2.5, // This seems to be a fixed value in your system
    largestWin: Math.max(...trades.map(t => t.pnlPercentage)),
    largestLoss: Math.min(...trades.map(t => t.pnlPercentage)),
    averageWin: winningTrades.length ? 
      winningTrades.reduce((sum, t) => sum + t.pnlPercentage, 0) / winningTrades.length : 0,
    averageLoss: trades.filter(t => t.pnlPercentage < 0).length ?
      trades.filter(t => t.pnlPercentage < 0)
        .reduce((sum, t) => sum + t.pnlPercentage, 0) / 
      trades.filter(t => t.pnlPercentage < 0).length : 0,
    profitFactor: lastTrade.profitFactor,
    sharpeRatio: lastTrade.sharpeRatio
  };
}

function getEmptyMetrics(): TradingMetrics {
  return {
    winRate: 0,
    totalTrades: 0,
    accountValue: 0,
    stopLoss: 2.5,
    largestWin: 0,
    largestLoss: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    sharpeRatio: 0
  };
}