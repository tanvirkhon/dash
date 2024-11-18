"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw,
  Wallet,
  BarChart2,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { VolumeChart } from "@/components/charts/volume-chart";
import { format } from "date-fns";

interface MarketData {
  id: number;
  timestamp: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Trade {
  id: number;
  timestamp: string;
  symbol: string;
  current_price: number;
  position_type: string;
  entry_price?: number;
  pnl?: number;
  size?: number;
  exit_price?: number;
}

interface Metrics {
  accountValue: number;
  totalTrades: number;
  winRate: number | null;
  averageWin: number;
  averageLoss: number;
  sharpeRatio: number;
  profitFactor: number;
  largestWin: number | null;
  largestLoss: number | null;
  stopLoss: number;
}

interface ApiResponse {
  marketData: MarketData[];
  trades: Trade[];
  metrics: Metrics;
}

function calculateTradingPerformance(trades: Trade[]): { value: number; description: string } {
  if (!trades.length) return { value: 0, description: 'No trades' };

  let totalPnL = 0;
  let winningTrades = 0;
  let consecutiveWins = 0;
  let maxConsecutiveWins = 0;

  trades.forEach((trade, index) => {
    if (trade.pnl) {
      totalPnL += trade.pnl;
      if (trade.pnl > 0) {
        winningTrades++;
        consecutiveWins++;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
      } else {
        consecutiveWins = 0;
      }
    }
  });

  const winRate = (winningTrades / trades.length) * 100;
  const averagePnL = totalPnL / trades.length;

  return {
    value: averagePnL * maxConsecutiveWins,
    description: `Win Rate: ${winRate.toFixed(1)}%`
  };
}

function calculateRiskMetrics(trades: Trade[]): { value: number; maxDrawdown: number } {
  if (!trades.length) return { value: 0, maxDrawdown: 0 };

  let balance = 100; // Starting balance
  let peak = balance;
  let maxDrawdown = 0;
  let totalRisk = 0;

  trades.forEach(trade => {
    if (trade.pnl) {
      balance *= (1 + trade.pnl / 100);
      
      if (balance > peak) {
        peak = balance;
      }
      
      const currentDrawdown = ((peak - balance) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, currentDrawdown);

      if (trade.pnl < 0) {
        totalRisk += Math.abs(trade.pnl);
      }
    }
  });

  const averageRisk = totalRisk / trades.length;

  return {
    value: averageRisk,
    maxDrawdown: maxDrawdown
  };
}

function StatCard({ 
  title, 
  value, 
  subValue, 
  icon: Icon, 
  trend = 0,
  prefix = "",
  suffix = "" 
}: { 
  title: string;
  value: string | number;
  subValue?: string;
  icon: any;
  trend?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <Icon className={`h-4 w-4 ${
          trend > 0 ? 'text-green-500' : 
          trend < 0 ? 'text-red-500' : 
          'text-blue-500'
        }`} />
      </div>
      <div className="text-2xl font-bold">
        {prefix}{value}{suffix}
      </div>
      {subValue && (
        <p className="text-xs text-muted-foreground">
          {subValue}
        </p>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'1H' | '4H' | '1D' | '1W'>('1H');

  async function loadData() {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/trading?t=${Date.now()}&range=${timeRange}`);
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
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const metrics = data?.metrics || {
    accountValue: 0,
    totalTrades: 0,
    winRate: 0,
    averageWin: 0,
    averageLoss: 0,
    sharpeRatio: 0,
    profitFactor: 0,
    largestWin: 0,
    largestLoss: 0,
    stopLoss: 0,
  };

  const latestTrade = data?.trades?.[0];
  const position = latestTrade?.position_type || 'NONE';
  const marketData = data?.marketData || [];
  const currentPrice = latestTrade?.current_price || 0;

  // Calculate daily change
  const dailyOpen = marketData[marketData.length - 1]?.open || 0;
  const dailyChange = ((currentPrice - dailyOpen) / dailyOpen) * 100;

  // Calculate volume
  const totalVolume = marketData.reduce((sum, item) => sum + item.volume, 0);
  const avgVolume = totalVolume / marketData.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">K2 Trading Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {format(new Date(), 'PPpp')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {(['1H', '4H', '1D', '1W'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <LoadingSpinner className="mr-2 h-4 w-4" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Account Value"
          value={metrics.accountValue.toFixed(2)}
          subValue={`${metrics.totalTrades} Total Trades`}
          icon={Wallet}
          prefix="$"
        />
        
        <StatCard
          title="Current Position"
          value={position}
          subValue={`Entry: ${latestTrade?.entry_price ? `$${latestTrade.entry_price.toFixed(2)}` : 'N/A'}`}
          icon={position === 'LONG' ? TrendingUp : position === 'SHORT' ? TrendingDown : Activity}
          trend={position === 'LONG' ? 1 : position === 'SHORT' ? -1 : 0}
        />

        <StatCard
          title="Win Rate"
          value={metrics.winRate ? metrics.winRate.toFixed(2) : '0.00'}
          subValue={`Profit Factor: ${metrics.profitFactor.toFixed(2)}`}
          icon={BarChart2}
          trend={metrics.winRate && metrics.winRate >= 50 ? 1 : -1}
          suffix="%"
        />

        <StatCard
          title="Risk Level"
          value={metrics.sharpeRatio > 1 ? 'Low' : 'Moderate'}
          subValue={`Sharpe: ${metrics.sharpeRatio.toFixed(2)}`}
          icon={AlertTriangle}
          trend={metrics.sharpeRatio > 1 ? 1 : -1}
        />
      </div>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="SOL Price"
          value={currentPrice.toFixed(2)}
          subValue={`${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}% Today`}
          icon={Clock}
          trend={dailyChange >= 0 ? 1 : -1}
          prefix="$"
        />

        <StatCard
          title="24h Volume"
          value={(totalVolume / 1000000).toFixed(2)}
          subValue={`Avg: ${(avgVolume / 1000000).toFixed(2)}M`}
          icon={BarChart2}
          suffix="M"
        />

        <StatCard
          title="Max Profit"
          value={metrics.largestWin ? metrics.largestWin.toFixed(2) : '0.00'}
          subValue={`Avg Win: ${metrics.averageWin.toFixed(2)}%`}
          icon={TrendingUp}
          trend={1}
          prefix="+"
          suffix="%"
        />

        <StatCard
          title="Max Drawdown"
          value={metrics.largestLoss ? Math.abs(metrics.largestLoss).toFixed(2) : '0.00'}
          subValue={`Stop Loss: ${metrics.stopLoss.toFixed(2)}%`}
          icon={TrendingDown}
          trend={-1}
          prefix="-"
          suffix="%"
        />
      </div>

      {/* Trading Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Trading Performance"
          value={calculateTradingPerformance(data?.trades || []).value.toFixed(2)}
          subValue={`${calculateTradingPerformance(data?.trades || []).description}`}
          icon={TrendingUp}
          trend={1}
          prefix="+"
          suffix="%"
        />

        <StatCard
          title="Risk Exposure"
          value={calculateRiskMetrics(data?.trades || []).value.toFixed(2)}
          subValue={`Max Drawdown: ${calculateRiskMetrics(data?.trades || []).maxDrawdown.toFixed(2)}%`}
          icon={AlertTriangle}
          trend={-1}
          suffix="%"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Price Chart */}
        <Card className="col-span-4 p-4">
          <div className="flex flex-col h-[450px]">
            <div className="flex items-center justify-between pb-6">
              <h3 className="text-lg font-medium">Price Action</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}% Today
                </span>
              </div>
            </div>
            <div className="flex-1">
              <CandlestickChart data={marketData} />
            </div>
          </div>
        </Card>

        {/* Volume and Stats */}
        <Card className="col-span-3 p-4">
          <div className="h-[450px]">
            <h3 className="text-lg font-medium pb-6">Volume Analysis</h3>
            <div className="h-48 mb-4">
              <VolumeChart data={marketData} />
            </div>
            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position Size</p>
                  <p className="text-xl font-bold">
                    ${latestTrade?.size ? latestTrade.size.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Exit</p>
                  <p className="text-xl font-bold">
                    ${latestTrade?.exit_price ? latestTrade.exit_price.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Streak</p>
                  <p className="text-xl font-bold text-green-500">
                    {data?.trades?.filter((t, i) => t.pnl && t.pnl > 0 && (!data.trades[i + 1]?.pnl || data.trades[i + 1].pnl > 0)).length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loss Streak</p>
                  <p className="text-xl font-bold text-red-500">
                    {data?.trades?.filter((t, i) => t.pnl && t.pnl < 0 && (!data.trades[i + 1]?.pnl || data.trades[i + 1].pnl < 0)).length || 0}
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