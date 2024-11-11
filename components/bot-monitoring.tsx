"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchTradingData } from "@/lib/services/airtable";
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";

export default function BotMonitoring() {
  const [isRunning, setIsRunning] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const data = await fetchTradingData();
        if (!mounted) return;
        
        setTrades(data.trades);
        setMetrics(data.metrics);
      } catch (error) {
        if (!mounted) return;
        console.error('Error fetching trading data:', error);
        toast.error("Failed to fetch trading data");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    const interval = setInterval(loadData, 30 * 1000); // Update every 30 seconds
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!metrics || trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p className="text-muted-foreground">No trading data available</p>
      </div>
    );
  }

  const lastTrade = trades[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bot Monitoring</h2>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant={isRunning ? "destructive" : "default"}
          className="ml-4"
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Account Value</h3>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.accountValue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total Trades: {metrics.totalTrades}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
          </div>
          <div className="text-2xl font-bold">{metrics.winRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Ratio of winning trades
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Profit Factor</h3>
          </div>
          <div className="text-2xl font-bold">{metrics.profitFactor.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Ratio of wins to losses
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Risk Level</h3>
            <AlertTriangle className={`h-4 w-4 ${metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-yellow-500'}`} />
          </div>
          <div className="text-2xl font-bold">
            {metrics.sharpeRatio > 1 ? 'Low' : 'Moderate'}
          </div>
          <p className="text-xs text-muted-foreground">
            Sharpe Ratio: {metrics.sharpeRatio.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between space-y-0 pb-6">
              <h3 className="text-lg font-medium">Performance Overview</h3>
            </div>
            <div className="flex-1">
              <PerformanceChart data={trades} />
            </div>
          </div>
        </Card>

        <Card className="col-span-3 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between space-y-0 pb-6">
              <h3 className="text-lg font-medium">Risk Management</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="text-xl font-bold">{formatPercentage(metrics.stopLoss)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Largest Win</p>
                  <p className="text-xl font-bold text-green-500">
                    {formatPercentage(metrics.largestWin)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Win</p>
                  <p className="text-xl font-bold text-green-500">
                    {formatPercentage(metrics.averageWin)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Loss</p>
                  <p className="text-xl font-bold text-red-500">
                    {formatPercentage(metrics.averageLoss)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}