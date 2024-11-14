"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  LineChart,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { fetchTradingData } from "@/lib/services/sheets";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { PerformanceMetrics } from "./performance-metrics";
import { TradeDistribution } from "./trade-distribution";
import { DrawdownChart } from "./drawdown-chart";
import { AIInsights } from "./ai-insights";
import { Trade, TradingMetrics } from "@/lib/types/trading";

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setIsLoading(true);
      const data = await fetchTradingData();
      setTrades(data.trades);
      setMetrics(data.metrics);
    } catch (error) {
      toast.error("Failed to fetch trading data");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      toast.success("Analysis complete!");
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Analytics & Insights
          </h2>
          <p className="text-muted-foreground">
            AI-powered analysis of your trading performance
          </p>
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analyzing
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" /> Analyze Performance
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Sharpe Ratio</h3>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            {metrics?.sharpeRatio.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Risk-adjusted return measure
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Profit Factor</h3>
            <LineChart className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">
            {metrics?.profitFactor.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Ratio of gross profit to gross loss
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Max Drawdown</h3>
            <BarChart2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">
            -{(metrics?.largestLoss || 0).toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Largest peak-to-trough decline
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceMetrics trades={trades} />
        <TradeDistribution trades={trades} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <DrawdownChart trades={trades} />
        </Card>
        <AIInsights trades={trades} metrics={metrics} />
      </div>
    </div>
  );
}
