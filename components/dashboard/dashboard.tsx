"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { fetchTradingData } from "@/lib/services/airtable";
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, RefreshCw } from "lucide-react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadData() {
    try {
      setIsRefreshing(true);
      const data = await fetchTradingData();
      setTrades(data.trades);
      setMetrics(data.metrics);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Error fetching trading data:', error);
      toast.error("Failed to fetch trading data");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initialLoad() {
      try {
        setIsLoading(true);
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

    initialLoad();
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
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Live Trading Dashboard</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-muted-foreground">
              Last updated: {new Date(lastTrade.timestamp).toLocaleString()}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={loadData}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Account Value</h3>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">
            ${metrics.accountValue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total Trades: {metrics.totalTrades}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Position</h3>
            {lastTrade.position === 'Long' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : lastTrade.position === 'Short' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Activity className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="text-2xl font-bold">{lastTrade.position}</div>
          <p className="text-xs text-muted-foreground">
            Entry: ${lastTrade.entryPrice.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
            {metrics.winRate >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="text-2xl font-bold">
            {metrics.winRate.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Winning Trades: {metrics.totalTrades}
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
            Sharpe: {metrics.sharpeRatio.toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between space-y-0 pb-6">
              <h3 className="text-lg font-medium">Performance Overview</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${lastTrade.cumulativeROI >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ROI: {lastTrade.cumulativeROI >= 0 ? '+' : ''}{lastTrade.cumulativeROI.toFixed(2)}%
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

        <Card className="col-span-3 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between space-y-0 pb-6">
              <h3 className="text-lg font-medium">Risk Management</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="text-xl font-bold text-red-500">
                    {metrics.stopLoss.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Max Win</p>
                  <p className="text-xl font-bold text-green-500">
                    +{metrics.largestWin.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Win</p>
                  <p className="text-xl font-bold text-green-500">
                    +{metrics.averageWin.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Loss</p>
                  <p className="text-xl font-bold text-red-500">
                    {metrics.averageLoss.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Profit Factor</h3>
          </div>
          <div className="text-2xl font-bold">
            {metrics.profitFactor.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Win/Loss Ratio
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Current Price</h3>
          </div>
          <div className="text-2xl font-bold">
            ${lastTrade.closePrice.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {lastTrade.symbol}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Latest PNL</h3>
            {lastTrade.pnlPercentage >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className={`text-2xl font-bold ${lastTrade.pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {lastTrade.pnlPercentage >= 0 ? '+' : ''}{lastTrade.pnlPercentage.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Last Trade
          </p>
        </Card>


        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Drawdown</h3>
          </div>
          <div className="text-2xl font-bold text-red-500">
            {metrics.largestLoss.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Maximum Loss
          </p>
        </Card>
      </div>
    </div>
  );
}