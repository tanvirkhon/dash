import { Trade } from "@/lib/types/trading";

export function generateMockTrades(count: number): Trade[] {
  const basePrice = 50000;
  const now = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;
  let cumulativeROI = 0;
  let accountValue = 14580;
  let profitFactor = 2.47;
  let sharpeRatio = 1.85;

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(now.getTime() - (count - i - 1) * dayInMs);
    const priceVariation = Math.random() * 1000 - 500;
    const pnl = (Math.random() * 4) - 2; // Random PNL between -2% and 2%
    cumulativeROI += pnl;
    accountValue *= (1 + pnl / 100);
    
    return {
      timestamp: date.toISOString(),
      symbol: 'SOL',
      closePrice: basePrice + priceVariation,
      position: Math.random() > 0.5 ? 'Long' as const : 'Short' as const,
      entryPrice: basePrice,
      pnlPercentage: pnl,
      cumulativeROI: cumulativeROI,
      accountValue: accountValue,
      equity: accountValue,
      drawdown: Math.min(-2, -Math.abs(pnl)),
      profitFactor: profitFactor + (Math.random() * 0.1 - 0.05),
      sharpeRatio: sharpeRatio + (Math.random() * 0.2 - 0.1)
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}