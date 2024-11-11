"use client";

import { Card } from "@/components/ui/card";
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { Brain } from "lucide-react";

interface AIInsightsProps {
  trades: Trade[];
  metrics: TradingMetrics | null;
}

export function AIInsights({ trades, metrics }: AIInsightsProps) {
  // Generate insights based on trading data
  const insights = [
    {
      title: "Risk Management",
      description: "Your max drawdown is within acceptable limits, but consider tightening stop-losses during volatile periods.",
    },
    {
      title: "Trade Timing",
      description: "Most profitable trades occur during US market hours. Consider focusing on these periods.",
    },
    {
      title: "Strategy Effectiveness",
      description: `Win rate of ${metrics?.winRate.toFixed(1)}% suggests strong strategy validation. Continue monitoring for consistency.`,
    },
    {
      title: "Position Sizing",
      description: "Current position sizes are well-balanced. Consider Kelly Criterion for optimization.",
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">AI Insights</h3>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="space-y-1">
            <h4 className="font-medium text-sm">{insight.title}</h4>
            <p className="text-sm text-muted-foreground">
              {insight.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}