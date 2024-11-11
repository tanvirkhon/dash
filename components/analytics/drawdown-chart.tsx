"use client";

import { Card } from "@/components/ui/card";
import { Trade } from "@/lib/types/trading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DrawdownChartProps {
  trades: Trade[];
}

export function DrawdownChart({ trades }: DrawdownChartProps) {
  // Calculate drawdown series
  const data = trades.map((trade, index) => {
    const peak = Math.max(...trades.slice(0, index + 1).map(t => t.cumulativeROI));
    const drawdown = ((trade.cumulativeROI - peak) / peak) * 100;
    
    return {
      date: new Date(trade.timestamp).toLocaleDateString(),
      drawdown: drawdown,
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Drawdown Analysis</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Drawdown"]}
            />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="hsl(var(--destructive))"
              fill="hsl(var(--destructive))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}