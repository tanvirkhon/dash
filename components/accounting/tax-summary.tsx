"use client";

import { Card } from "@/components/ui/card";
import { Trade } from "@/lib/types/trading";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { Progress } from "@/components/ui/progress";

interface TaxSummaryProps {
  trades: Trade[];
  year: number;
}

export function TaxSummary({ trades, year }: TaxSummaryProps) {
  // Calculate tax metrics
  const shortTermTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.timestamp);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return tradeDate > oneYearAgo;
  });

  const longTermTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.timestamp);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return tradeDate <= oneYearAgo;
  });

  const calculateTradeMetrics = (tradelist: Trade[]) => {
    const profits = tradelist.filter(t => t.pnlPercentage > 0);
    const losses = tradelist.filter(t => t.pnlPercentage < 0);
    
    const totalProfit = profits.reduce((sum, t) => 
      sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);
    const totalLoss = losses.reduce((sum, t) => 
      sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);

    return {
      count: tradelist.length,
      profits: totalProfit,
      losses: totalLoss,
      net: totalProfit + totalLoss
    };
  };

  const shortTermMetrics = calculateTradeMetrics(shortTermTrades);
  const longTermMetrics = calculateTradeMetrics(longTermTrades);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Tax Summary {year}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Overview of your trading activity for tax purposes
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Short-term Capital Gains</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Trades held less than one year (Higher tax rate)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="font-medium">{shortTermMetrics.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Realized Gains</span>
              <span className="font-medium text-green-500">
                {formatCurrency(shortTermMetrics.profits)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Realized Losses</span>
              <span className="font-medium text-red-500">
                {formatCurrency(shortTermMetrics.losses)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Net Profit/Loss</span>
                <span className={`font-bold ${shortTermMetrics.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(shortTermMetrics.net)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Estimated Tax Rate</span>
                <span>25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-4">Long-term Capital Gains</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Trades held more than one year (Lower tax rate)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Trades</span>
              <span className="font-medium">{longTermMetrics.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Realized Gains</span>
              <span className="font-medium text-green-500">
                {formatCurrency(longTermMetrics.profits)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Realized Losses</span>
              <span className="font-medium text-red-500">
                {formatCurrency(longTermMetrics.losses)}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Net Profit/Loss</span>
                <span className={`font-bold ${longTermMetrics.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(longTermMetrics.net)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Estimated Tax Rate</span>
                <span>15%</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tax Obligations Summary</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Estimated Short-term Tax</p>
              <p className="text-xl font-bold">
                {formatCurrency(Math.max(0, shortTermMetrics.net * 0.25))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Long-term Tax</p>
              <p className="text-xl font-bold">
                {formatCurrency(Math.max(0, longTermMetrics.net * 0.15))}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Estimated Tax</p>
              <p className="text-xl font-bold">
                {formatCurrency(
                  Math.max(0, shortTermMetrics.net * 0.25) +
                  Math.max(0, longTermMetrics.net * 0.15)
                )}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}