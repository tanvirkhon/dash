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
  Clock,
  Power
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandlestickChart } from "@/components/charts/candlestick-chart";
import { VolumeChart } from "@/components/charts/volume-chart";
import { format } from "date-fns";
import BotControl from "@/components/bot-control/bot-control";

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
  leverage: number;
  position: {
    isOpen: boolean;
    entryPrice: number;
    currentPnl: number;
    highestPrice: number;
  };
  marketStats: {
    '24h_high': number;
    '24h_low': number;
    '24h_volume': number;
    volatility: number;
  };
  indicators: {
    ema1: number;
    ema2: number;
    hma: number;
    rsi: number;
  };
}

interface ApiResponse {
  marketData: {
    market_data: {
      current_price: number;
    };
  };
  metrics: Metrics;
  botStatus: {
    enabled: boolean;
    leverage: number;
  };
  lastUpdate: number;
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
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  async function loadData() {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/trading?t=${Date.now()}&range=${timeRange}`);
      const result = await response.json();
      console.log('Fetched data:', result);
      setData(result);
      setLastUpdate(result.lastUpdate || Date.now());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
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
    leverage: 1,
    position: {
      isOpen: false,
      entryPrice: 0,
      currentPnl: 0,
      highestPrice: 0
    },
    marketStats: {
      '24h_high': 0,
      '24h_low': 0,
      '24h_volume': 0,
      volatility: 0
    },
    indicators: {
      ema1: 0,
      ema2: 0,
      hma: 0,
      rsi: 0
    }
  };

  const marketData = data?.marketData?.market_data || null;
  const currentPrice = marketData?.current_price || 0;
  const position = metrics.position;
  const marketStats = metrics.marketStats;

  // Calculate daily change
  const dailyChange = marketStats['24h_high'] > 0 
    ? ((currentPrice - marketStats['24h_low']) / marketStats['24h_low']) * 100
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">K2 Trading Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {format(new Date(lastUpdate * 1000), 'PPpp')}
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

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="SOL Price"
          value={currentPrice.toFixed(2)}
          subValue={`${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}% Today`}
          icon={TrendingUp}
          trend={dailyChange}
          prefix="$"
        />
        <StatCard
          title="24h Volume"
          value={(marketStats['24h_volume'] / 1000000).toFixed(2)}
          subValue={`High: $${marketStats['24h_high'].toFixed(2)}`}
          icon={BarChart2}
          suffix="M"
        />
        <StatCard
          title="Position"
          value={position.isOpen ? 'OPEN' : 'CLOSED'}
          subValue={position.isOpen ? `Entry: $${position.entryPrice.toFixed(2)}` : 'No position'}
          icon={Wallet}
          trend={position.isOpen ? 1 : 0}
        />
        <StatCard
          title="Current PnL"
          value={position.currentPnl.toFixed(2)}
          subValue={`High: $${position.highestPrice.toFixed(2)}`}
          icon={position.currentPnl >= 0 ? TrendingUp : TrendingDown}
          trend={position.currentPnl}
          prefix="$"
        />
      </div>

      {/* Trading Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Account Value"
          value={metrics.accountValue.toFixed(2)}
          subValue={`${metrics.totalTrades} Total Trades`}
          icon={Wallet}
          prefix="$"
        />
        <StatCard
          title="Win Rate"
          value={metrics.winRate.toFixed(2)}
          subValue={`Profit Factor: ${metrics.profitFactor.toFixed(2)}`}
          icon={metrics.winRate >= 50 ? TrendingUp : TrendingDown}
          trend={metrics.winRate >= 50 ? 1 : -1}
          suffix="%"
        />
        <StatCard
          title="Max Profit"
          value={metrics.largestWin?.toFixed(2) || "0.00"}
          subValue={`Avg Win: ${metrics.averageWin.toFixed(2)}%`}
          icon={TrendingUp}
          suffix="%"
        />
        <StatCard
          title="Max Drawdown"
          value={metrics.largestLoss?.toFixed(2) || "0.00"}
          subValue={`Stop Loss: ${metrics.stopLoss.toFixed(2)}%`}
          icon={AlertTriangle}
          suffix="%"
        />
      </div>

      {/* Technical Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="RSI"
          value={metrics.indicators.rsi.toFixed(2)}
          subValue={metrics.indicators.rsi > 70 ? 'Overbought' : metrics.indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
          icon={Activity}
        />
        <StatCard
          title="EMA Trend"
          value={(metrics.indicators.ema1 - metrics.indicators.ema2).toFixed(2)}
          subValue={metrics.indicators.ema1 > metrics.indicators.ema2 ? 'Bullish' : 'Bearish'}
          icon={metrics.indicators.ema1 > metrics.indicators.ema2 ? TrendingUp : TrendingDown}
          trend={metrics.indicators.ema1 > metrics.indicators.ema2 ? 1 : -1}
        />
        <StatCard
          title="Volatility"
          value={(metrics.marketStats.volatility * 100).toFixed(2)}
          subValue={metrics.marketStats.volatility > 0.02 ? 'High' : metrics.marketStats.volatility > 0.01 ? 'Medium' : 'Low'}
          icon={Activity}
          suffix="%"
        />
        <StatCard
          title="Current Leverage"
          value={metrics.leverage}
          subValue={`Risk: ${(metrics.leverage * metrics.marketStats.volatility * 100).toFixed(2)}%`}
          icon={AlertTriangle}
          suffix="x"
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
              <CandlestickChart 
                data={[{
                  timestamp: new Date(lastUpdate * 1000).toISOString(),
                  open: currentPrice * (1 - metrics.marketStats.volatility),
                  high: metrics.marketStats['24h_high'],
                  low: metrics.marketStats['24h_low'],
                  close: currentPrice,
                  volume: metrics.marketStats['24h_volume']
                }]} 
              />
            </div>
          </div>
        </Card>

        {/* Volume and Stats */}
        <Card className="col-span-3 p-4">
          <div className="h-[450px]">
            <h3 className="text-lg font-medium pb-6">Trading Analysis</h3>
            <div className="h-48 mb-4">
              <VolumeChart 
                data={[{
                  timestamp: new Date(lastUpdate * 1000).toISOString(),
                  volume: metrics.marketStats['24h_volume']
                }]} 
              />
            </div>
            <div className="space-y-4 mt-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position Status</p>
                  <p className={`text-xl font-bold ${position.isOpen ? 'text-green-500' : 'text-yellow-500'}`}>
                    {position.isOpen ? 'OPEN' : 'CLOSED'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entry Price</p>
                  <p className="text-xl font-bold">
                    ${position.entryPrice > 0 ? position.entryPrice.toFixed(2) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current PnL</p>
                  <p className={`text-xl font-bold ${position.currentPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {position.currentPnl >= 0 ? '+' : ''}{position.currentPnl.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Highest Price</p>
                  <p className="text-xl font-bold text-green-500">
                    ${position.highestPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Technical Levels</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">EMA Fast</p>
                    <p className="text-lg font-semibold">${metrics.indicators.ema1.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">EMA Slow</p>
                    <p className="text-lg font-semibold">${metrics.indicators.ema2.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">HMA</p>
                    <p className="text-lg font-semibold">${metrics.indicators.hma.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RSI</p>
                    <p className={`text-lg font-semibold ${
                      metrics.indicators.rsi > 70 ? 'text-red-500' : 
                      metrics.indicators.rsi < 30 ? 'text-green-500' : 
                      'text-yellow-500'
                    }`}>
                      {metrics.indicators.rsi.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}