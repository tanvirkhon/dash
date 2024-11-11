"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from "lucide-react";

interface BotPerformanceProps {
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
}

export function BotPerformance({ performance }: BotPerformanceProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Win Rate</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {performance.winRate.toFixed(1)}%
          </span>
        </div>
        <Progress value={performance.winRate} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Profit Factor</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {performance.profitFactor.toFixed(2)}
          </span>
        </div>
        <Progress
          value={(performance.profitFactor / 3) * 100}
          className="h-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Sharpe Ratio</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {performance.sharpeRatio.toFixed(2)}
          </span>
        </div>
        <Progress
          value={(performance.sharpeRatio / 5) * 100}
          className="h-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Max Drawdown</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {performance.maxDrawdown.toFixed(1)}%
          </span>
        </div>
        <Progress
          value={Math.abs((performance.maxDrawdown / -30) * 100)}
          className="h-2"
        />
      </div>
    </div>
  );
}