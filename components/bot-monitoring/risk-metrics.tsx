"use client";

import { Card } from "@/components/ui/card";
import { TradingMetrics } from "@/lib/types/trading";
import { formatPercentage } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface RiskMetricsProps {
  metrics: TradingMetrics;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  color?: string;
}

function MetricItem({ label, value, trend, color }: MetricItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {trend && (
          trend === "up" ? 
            <TrendingUp className="h-4 w-4 text-green-500" /> :
            <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );
}

export function RiskMetrics({ metrics }: RiskMetricsProps) {
  // Calculate additional metrics
  const riskRewardRatio = Math.abs(metrics.averageWin / metrics.averageLoss);
  const successScore = (metrics.winRate / 100) * metrics.profitFactor;
  
  return (
    <Card className="col-span-3 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Risk Management</h3>
        <AlertTriangle className={`h-5 w-5 ${metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-yellow-500'}`} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <MetricItem
          label="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          trend={metrics.winRate > 50 ? "up" : "down"}
        />
        
        <MetricItem
          label="Profit Factor"
          value={metrics.profitFactor.toFixed(2)}
          trend={metrics.profitFactor > 1 ? "up" : "down"}
        />
        
        <MetricItem
          label="Sharpe Ratio"
          value={metrics.sharpeRatio.toFixed(2)}
          trend={metrics.sharpeRatio > 1 ? "up" : "down"}
        />
        
        <MetricItem
          label="Average Win"
          value={formatPercentage(metrics.averageWin)}
          color="text-green-500"
          trend="up"
        />
        
        <MetricItem
          label="Average Loss"
          value={formatPercentage(metrics.averageLoss)}
          color="text-red-500"
          trend="down"
        />
        
        <MetricItem
          label="Risk/Reward"
          value={riskRewardRatio.toFixed(2)}
          trend={riskRewardRatio > 1 ? "up" : "down"}
        />
        
        <MetricItem
          label="Largest Win"
          value={formatPercentage(metrics.largestWin)}
          color="text-green-500"
          trend="up"
        />
        
        <MetricItem
          label="Largest Loss"
          value={formatPercentage(metrics.largestLoss)}
          color="text-red-500"
          trend="down"
        />
        
        <MetricItem
          label="Success Score"
          value={successScore.toFixed(2)}
          trend={successScore > 1 ? "up" : "down"}
        />
      </div>
    </Card>
  );
}