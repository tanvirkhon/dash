"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Message } from "@/lib/types/chat";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";

interface BacktestVisualizerProps {
  messages: Message[];
}

interface BacktestResult {
  timestamp: string;
  price: number;
  position: 'Long' | 'Short' | 'None';
  pnl: number;
  equity: number;
}

export function BacktestVisualizer({ messages }: BacktestVisualizerProps) {
  const [results, setResults] = useState<BacktestResult[]>([]);
  const [metrics, setMetrics] = useState({
    totalReturn: 0,
    winRate: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    profitFactor: 0,
  });

  // Extract backtest results from messages
  useEffect(() => {
    // This is a placeholder. In a real implementation,
    // we would parse actual backtest results from the AI's responses
    const mockResults: BacktestResult[] = Array.from({ length: 100 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - i);
      
      return {
        timestamp: date.toISOString(),
        price: 100 + Math.sin(i / 10) * 10,
        position: Math.random() > 0.5 ? 'Long' : 'Short',
        pnl: (Math.random() - 0.5) * 2,
        equity: 100 + Math.random() * 20,
      };
    }).reverse();

    setResults(mockResults);
    
    // Calculate metrics
    const returns = mockResults.map(r => r.pnl);
    const totalReturn = returns.reduce((a, b) => a + b, 0);
    const wins = returns.filter(r => r > 0).length;
    
    setMetrics({
      totalReturn,
      winRate: (wins / returns.length) * 100,
      sharpeRatio: 1.5,
      maxDrawdown: -15,
      profitFactor: 1.8,
    });
  }, [messages]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Total Return</h4>
          <p className={`text-2xl font-bold ${metrics.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatPercentage(metrics.totalReturn)}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Win Rate</h4>
          <p className="text-2xl font-bold">{formatPercentage(metrics.winRate)}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Sharpe Ratio</h4>
          <p className="text-2xl font-bold">{metrics.sharpeRatio.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Max Drawdown</h4>
          <p className="text-2xl font-bold text-red-500">{formatPercentage(metrics.maxDrawdown)}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground">Profit Factor</h4>
          <p className="text-2xl font-bold">{metrics.profitFactor.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="flex-1 p-4">
        <h3 className="text-lg font-medium mb-4">Equity Curve</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="hsl(var(--primary))"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}