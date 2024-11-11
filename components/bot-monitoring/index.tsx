"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, AlertTriangle, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchTradingData } from "@/lib/services/sheets";
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { toast } from "sonner";
import { MetricsCard } from "./metrics-card";
import { RiskMetrics } from "./risk-metrics";
import { Card } from "@/components/ui/card";
import { TradingStats } from "./trading-stats";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";

export default function BotMonitoring() {
  const [isRunning, setIsRunning] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadData() {
    try {
      setIsRefreshing(true);
      setError(null);
      const data = await fetchTradingData();
      
      if (!data.trades.length) {
        setError('No trading data available');
        return;
      }
      
      setTrades(data.trades);
      setMetrics(data.metrics);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Error fetching trading data:', error);
      setError('Failed to fetch trading data');
      toast.error("Failed to fetch trading data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !metrics || trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <p className="text-muted-foreground text-center max-w-md">
          {error || 'No trading data available'}
        </p>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  const lastTrade = trades[0];
  const dailyPnL = trades
    .filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.pnlPercentage, 0);

  const weeklyPnL = trades
    .filter(t => {
      const tradeDate = new Date(t.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tradeDate >= weekAgo;
    })
    .reduce((sum, t) => sum + t.pnlPercentage, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bot Monitoring</h2>
          <p className="text-muted-foreground">
            Last updated: {new Date(lastTrade.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadData}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> Stop Bot
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Start Bot
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Account Value"
          value={formatCurrency(metrics.accountValue)}
          subtitle={`Total Trades: ${metrics.totalTrades}`}
          trend={metrics.accountValue > 0 ? "up" : "down"}
          trendValue={`${formatPercentage(lastTrade.cumulativeROI)}`}
        />
        <MetricsCard
          title="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          subtitle={`${trades.filter(t => t.pnlPercentage > 0).length} winning trades`}
          progress={metrics.winRate}
        />
        <MetricsCard
          title="Daily P&L"
          value={formatPercentage(dailyPnL)}
          subtitle="Today's performance"
          trend={dailyPnL >= 0 ? "up" : "down"}
        />
        <MetricsCard
          title="Weekly P&L"
          value={formatPercentage(weeklyPnL)}
          subtitle="Last 7 days"
          trend={weeklyPnL >= 0 ? "up" : "down"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Profit Factor"
          value={metrics.profitFactor.toFixed(2)}
          subtitle="Ratio of wins to losses"
          trend={metrics.profitFactor > 1 ? "up" : "down"}
        />
        <MetricsCard
          title="Sharpe Ratio"
          value={metrics.sharpeRatio.toFixed(2)}
          subtitle="Risk-adjusted return"
          trend={metrics.sharpeRatio > 1 ? "up" : "down"}
        />
        <MetricsCard
          title="Max Drawdown"
          value={formatPercentage(metrics.largestLoss)}
          subtitle="Largest peak-to-trough decline"
          trend="down"
        />
        <MetricsCard
          title="Risk Level"
          value={metrics.sharpeRatio > 1 ? 'Low' : 'Moderate'}
          subtitle={`Volatility: ${(Math.abs(metrics.averageLoss) * 100).toFixed(2)}%`}
          icon={<AlertTriangle className={`h-4 w-4 ${metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-yellow-500'}`} />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Average Win"
          value={formatPercentage(metrics.averageWin)}
          subtitle="Mean winning trade"
          trend="up"
        />
        <MetricsCard
          title="Average Loss"
          value={formatPercentage(metrics.averageLoss)}
          subtitle="Mean losing trade"
          trend="down"
        />
        <MetricsCard
          title="Largest Win"
          value={formatPercentage(metrics.largestWin)}
          subtitle="Best performing trade"
          trend="up"
        />
        <MetricsCard
          title="Win Streak"
          value={calculateWinStreak(trades)}
          subtitle="Consecutive winning trades"
          trend="up"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between space-y-0 pb-6">
              <h3 className="text-lg font-medium">Performance Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  ROI: {formatPercentage(lastTrade.cumulativeROI)}
                </span>
                {lastTrade.cumulativeROI >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <PerformanceChart data={trades} />
            </div>
          </div>
        </Card>
        <RiskMetrics metrics={metrics} />
      </div>

      <TradingStats lastTrade={lastTrade} />
    </div>
  );
}

function calculateWinStreak(trades: Trade[]): number {
  let currentStreak = 0;
  for (const trade of trades) {
    if (trade.pnlPercentage > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  return currentStreak;
}