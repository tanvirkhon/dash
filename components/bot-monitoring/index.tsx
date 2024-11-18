"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, AlertTriangle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import { useSupabase } from '@/components/providers/supabase-provider';
import { Database, TradeData } from '@/lib/types/supabase';

export default function BotMonitoring() {
  const { supabase } = useSupabase();
  const [isRunning, setIsRunning] = useState(false);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadData() {
    try {
      setIsRefreshing(true);
      setError(null);

      // Fetch latest trades from Supabase
      const { data: tradeData, error: tradeError } = await supabase
        .from('trade_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (tradeError) throw tradeError;
      if (!tradeData || tradeData.length === 0) {
        console.log('No trade data available');
        setError('No trading data available');
        return;
      }

      console.log('Fetched trade data:', tradeData);

      // Calculate metrics
      const validTrades = tradeData.filter(t => t.pnl_percent !== null);
      console.log('Valid trades:', validTrades.length);

      const winningTrades = validTrades.filter(t => t.pnl_percent !== null && t.pnl_percent > 0);
      const losingTrades = validTrades.filter(t => t.pnl_percent !== null && t.pnl_percent < 0);
      const winRate = validTrades.length > 0 ? (winningTrades.length / validTrades.length) * 100 : 0;

      console.log('Metrics calculation:', {
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate
      });

      const metrics: TradingMetrics = {
        accountValue: tradeData[0].account_value !== null ? tradeData[0].account_value : 0,
        totalTrades: validTrades.length,
        winRate,
        averageWin: winningTrades.length > 0
          ? winningTrades.reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0) / winningTrades.length
          : 0,
        averageLoss: losingTrades.length > 0
          ? losingTrades.reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0) / losingTrades.length
          : 0,
        largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl_percent || 0)) : 0,
        largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl_percent || 0)) : 0,
        profitFactor: calculateProfitFactor(validTrades),
        sharpeRatio: calculateSharpeRatio(validTrades),
        stopLoss: tradeData[0].trailing_stop !== null ? tradeData[0].trailing_stop : 2.5,
      };

      console.log('Calculated metrics:', metrics);

      setTrades(tradeData);
      setMetrics(metrics);
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
    const interval = setInterval(loadData, 30 * 1000); // Refresh every 30 seconds
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
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const lastTrade = trades[0];
  const dailyPnL = trades
    .filter(t => {
      const tradeDate = new Date(t.timestamp).toDateString();
      const today = new Date().toDateString();
      return tradeDate === today && t.pnl_percent !== null;
    })
    .reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0);

  const weeklyPnL = trades
    .filter(t => {
      const tradeDate = new Date(t.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tradeDate >= weekAgo && t.pnl_percent !== null;
    })
    .reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0);

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
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" /> Stop Bot
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" /> Start Bot
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Account Value</span>
            <span className="text-2xl font-bold">
              {formatCurrency(metrics.accountValue)}
            </span>
            <span className="text-sm text-muted-foreground">
              Total Trades: {metrics.totalTrades}
            </span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Daily P&L</span>
            <span className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(dailyPnL)}
            </span>
            <span className="text-sm text-muted-foreground">Today's performance</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Weekly P&L</span>
            <span className={`text-2xl font-bold ${weeklyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(weeklyPnL)}
            </span>
            <span className="text-sm text-muted-foreground">Last 7 days</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">Win Rate</span>
            <span className={`text-2xl font-bold ${metrics.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(metrics.winRate)}
            </span>
            <span className="text-sm text-muted-foreground">
              Winning Trades: {metrics.totalTrades}
            </span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-medium">Performance Overview</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${(lastTrade.pnl_percent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ROI: {(lastTrade.pnl_percent || 0) >= 0 ? '+' : ''}{(lastTrade.pnl_percent || 0).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="flex-1">
              <PerformanceChart data={trades} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-medium">Risk Management</h3>
            </div>
            <div className="grid gap-4">
              <div>
                <span className="text-sm font-medium">Average Win</span>
                <span className="text-2xl font-bold block text-green-500">
                  {formatPercentage(metrics.averageWin)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Average Loss</span>
                <span className="text-2xl font-bold block text-red-500">
                  {formatPercentage(metrics.averageLoss)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Profit Factor</span>
                <span className="text-2xl font-bold block">
                  {metrics.profitFactor.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium">Sharpe Ratio</span>
                <span className="text-2xl font-bold block">
                  {metrics.sharpeRatio.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function calculateProfitFactor(trades: TradeData[]): number {
  const winningTrades = trades.filter(t => t.pnl_percent !== null && t.pnl_percent > 0);
  const losingTrades = trades.filter(t => t.pnl_percent !== null && t.pnl_percent < 0);

  const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl_percent !== null ? t.pnl_percent : 0), 0));

  return totalLosses === 0 ? totalWins : totalWins / totalLosses;
}

function calculateSharpeRatio(trades: TradeData[]): number {
  const returns = trades.map(t => t.pnl_percent !== null ? t.pnl_percent : 0);
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(
    returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length
  );

  return stdDev === 0 ? 0 : (meanReturn / stdDev) * Math.sqrt(252); // Annualized
}