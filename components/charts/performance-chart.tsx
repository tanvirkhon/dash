"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Trade } from "@/lib/types/trading";
import { cn } from "@/lib/utils";

interface PerformanceChartProps {
  data: Trade[];
  className?: string;
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  const chartData = useMemo(() => {
    // Sort data by timestamp in ascending order
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedData.map((trade) => ({
      timestamp: new Date(trade.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      roi: trade.cumulativeROI,
      pnl: trade.pnlPercentage,
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="roi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          axisLine={false}
          dy={10}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          dx={-10}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          tickFormatter={(value) => `${value.toFixed(2)}%`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Date
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {data.timestamp}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        ROI
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {data.roi.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Daily PNL
                      </span>
                      <span className={cn(
                        "font-bold",
                        data.pnl >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {data.pnl.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="roi"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#roi)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}