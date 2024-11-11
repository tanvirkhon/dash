"use client";

import { Card } from "@/components/ui/card";
import { Trade } from "@/lib/types/trading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TradeDistributionProps {
  trades: Trade[];
}

export function TradeDistribution({ trades }: TradeDistributionProps) {
  // Calculate profit distribution in ranges
  const profitRanges = trades.reduce((acc, trade) => {
    const range = Math.floor(trade.pnlPercentage / 2) * 2;
    const key = `${range}% to ${range + 2}%`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(profitRanges)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => {
      const aVal = parseFloat(a.range);
      const bVal = parseFloat(b.range);
      return aVal - bVal;
    });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Profit Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}