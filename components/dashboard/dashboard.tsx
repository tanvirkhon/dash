"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/charts/performance-chart";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadData() {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/trading?t=${Date.now()}`);
      const result = await response.json();
      console.log('Fetched data:', result);
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !data) {
    return <LoadingSpinner />;
  }

  const { currentState, metrics, trades } = data;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Trading Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
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

      {/* Top Stats */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Account Value */}
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

        {/* Position */}
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Position</h3>
            {currentState.position === 'Long' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : currentState.position === 'Short' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <Activity className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="text-2xl font-bold">
            {currentState.position}
          </div>
          <p className="text-xs text-muted-foreground">
            Entry: ${currentState.entryPrice.toFixed(2)}
          </p>
        </Card>

        {/* Win Rate */}
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

        {/* Risk Level */}
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Risk Level</h3>
            <Activity className={`h-4 w-4 ${metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-yellow-500'}`} />
          </div>
          <div className="text-2xl font-bold">
            {metrics.sharpeRatio > 1 ? 'Low' : 'Moderate'}
          </div>
          <p className="text-xs text-muted-foreground">
            Sharpe: {metrics.sharpeRatio.toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Charts and Risk Management */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Performance Chart */}
        <Card className="col-span-4 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-medium">Performance Overview</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${currentState.lastPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ROI: {currentState.lastPnL >= 0 ? '+' : ''}{currentState.lastPnL.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <PerformanceChart data={trades} />
            </div>
          </div>
        </Card>

        {/* Risk Management */}
        <Card className="col-span-3 p-4">
          <div className="flex flex-col h-[450px]">
            <h3 className="text-lg font-medium pb-6">Risk Management</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="text-xl font-bold text-red-500">
                    ${metrics.stopLoss.toFixed(2)}
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

      {/* Bottom Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Profit Factor */}
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

        {/* Current Price */}
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Current Price</h3>
          </div>
          <div className="text-2xl font-bold">
            ${currentState.currentPrice.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            SOL
          </p>
        </Card>

        {/* Latest PNL */}
        <Card className="p-4">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Latest PNL</h3>
            {currentState.lastPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className={`text-2xl font-bold ${currentState.lastPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {currentState.lastPnL >= 0 ? '+' : ''}{currentState.lastPnL.toFixed(2)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Last Trade
          </p>
        </Card>

        {/* Drawdown */}
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