"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trade } from "@/lib/types/trading";
import { formatCurrency } from "@/lib/utils/format";

interface MonthlyReportProps {
  trades: Trade[];
  year: number;
}

export function MonthlyReport({ trades, year }: MonthlyReportProps) {
  // Calculate monthly metrics
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthTrades = trades.filter(trade => {
      const date = new Date(trade.timestamp);
      return date.getMonth() === i && date.getFullYear() === year;
    });

    const profits = monthTrades.filter(t => t.pnlPercentage > 0);
    const losses = monthTrades.filter(t => t.pnlPercentage < 0);
    
    const totalProfit = profits.reduce((sum, t) => 
      sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);
    const totalLoss = losses.reduce((sum, t) => 
      sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);

    return {
      month: new Date(year, i).toLocaleString('default', { month: 'short' }),
      profit: totalProfit,
      loss: Math.abs(totalLoss),
      net: totalProfit + totalLoss,
      trades: monthTrades.length
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Monthly Performance {year}</h3>
        <p className="text-sm text-muted-foreground">
          Breakdown of trading performance by month
        </p>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `${label} ${year}`}
            />
            <Bar dataKey="profit" name="Profit" fill="hsl(var(--success))" />
            <Bar dataKey="loss" name="Loss" fill="hsl(var(--destructive))" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {monthlyData.map((month) => (
          <div key={month.month} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{month.month}</h4>
              <span className="text-sm text-muted-foreground">
                {month.trades} trades
              </span>
            </div>
            <div className={`text-lg font-bold ${month.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(month.net)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}