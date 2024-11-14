"use client";

import { Trade } from "@/lib/types/trading";
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { format } from "date-fns";

interface PerformanceChartProps {
  data: Trade[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data
    .filter(trade => !isNaN(trade.accountValue) && trade.accountValue > 0)
    .map((trade) => ({
      timestamp: new Date(trade.timestamp),
      value: trade.accountValue,
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const minValue = Math.min(...chartData.map(d => d.value));
  const maxValue = Math.max(...chartData.map(d => d.value));
  const yAxisDomain = [
    Math.floor(minValue * 0.95),
    Math.ceil(maxValue * 1.05)
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={1} />
          </linearGradient>
        </defs>
        
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#333" 
          opacity={0.1} 
          vertical={false}
        />
        
        <XAxis
          dataKey="timestamp"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(time) => format(new Date(time), "HH:mm")}
          minTickGap={30}
        />
        
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={yAxisDomain}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
          width={80}
        />
        
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const value = payload[0].value as number;
              const timestamp = payload[0].payload.timestamp as Date;
              return (
                <div className="bg-background/95 p-3 rounded-lg border shadow-lg">
                  <p className="text-sm font-medium mb-1">
                    Account Value
                  </p>
                  <p className="text-lg font-bold text-blue-500">
                    ${value.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(timestamp, "MMM d, HH:mm")}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="url(#colorStroke)"
          strokeWidth={2}
          fill="url(#colorValue)"
          animationDuration={500}
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#colorStroke)"
          strokeWidth={2.5}
          dot={false}
          animationDuration={500}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}