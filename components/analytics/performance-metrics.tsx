"use client";

import { Card } from "@/components/ui/card";
import { Trade } from "@/lib/types/trading";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceMetricsProps {
  trades: Trade[];
}

export function PerformanceMetrics({ trades }: PerformanceMetricsProps) {
  const data = trades.map((trade) => ({
    date: new Date(trade.timestamp).toLocaleDateString(),
    roi: trade.cumulativeROI,
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Cumulative Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              formatter={(value: number) => [`${value.toFixed(2)}%`, "ROI"]}
            />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}