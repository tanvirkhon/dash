"use client";

import { Card } from "@/components/ui/card";
import { Trade } from "@/lib/types/trading";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, Clock, DollarSign, Activity, Target, BarChart2 } from "lucide-react";

interface TradingStatsProps {
  lastTrade: Trade;
}

export function TradingStats({ lastTrade }: TradingStatsProps) {
  const stats = [
    {
      label: "Last Position",
      value: lastTrade.position,
      icon: lastTrade.position === 'Long' ? TrendingUp : TrendingDown,
      color: lastTrade.position === 'Long' ? 'text-green-500' : 'text-red-500'
    },
    {
      label: "Entry Price",
      value: formatCurrency(lastTrade.entryPrice),
      icon: DollarSign,
      color: 'text-blue-500'
    },
    {
      label: "Current Price",
      value: formatCurrency(lastTrade.closePrice),
      icon: DollarSign,
      color: 'text-purple-500'
    },
    {
      label: "Last Updated",
      value: new Date(lastTrade.timestamp).toLocaleTimeString(),
      icon: Clock,
      color: 'text-orange-500'
    },
    {
      label: "Current ROI",
      value: formatPercentage(lastTrade.cumulativeROI),
      icon: Activity,
      color: lastTrade.cumulativeROI >= 0 ? 'text-green-500' : 'text-red-500'
    },
    {
      label: "Stop Loss",
      value: formatPercentage(2.5),
      icon: Target,
      color: 'text-yellow-500'
    },
    {
      label: "Volatility",
      value: formatPercentage(Math.abs(lastTrade.pnlPercentage)),
      icon: BarChart2,
      color: 'text-cyan-500'
    },
    {
      label: "Trading Volume",
      value: formatCurrency(lastTrade.accountValue * lastTrade.closePrice),
      icon: DollarSign,
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">{stat.label}</h3>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </Card>
      ))}
    </div>
  );
}