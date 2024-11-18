"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  PieChart,
  LineChart,
  Calendar,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, subDays, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

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

interface ApiResponse {
  trades: Trade[];
  marketData: MarketData[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: any;
  trend?: number;
}

function StatCard({ title, value, subValue, icon: Icon, trend = 0 }: StatCardProps) {
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
      <div className="text-2xl font-bold">{value}</div>
      {subValue && (
        <p className="text-xs text-muted-foreground">{subValue}</p>
      )}
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M'>('1W');

  async function fetchData() {
    try {
      const response = await fetch(`/api/trading?t=${Date.now()}`);
      const result = await response.json();
      setData(result);
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate performance metrics
  const trades = data.trades || [];
  const profitableTrades = trades.filter(t => t.pnl && t.pnl > 0);
  const lossTrades = trades.filter(t => t.pnl && t.pnl < 0);
  
  const winRate = trades.length > 0 ? (profitableTrades.length / trades.length) * 100 : 0;
  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const avgTradeSize = trades.reduce((sum, trade) => sum + (trade.size || 0), 0) / trades.length;
  
  // Prepare chart data
  const dailyPnL = trades.reduce((acc, trade) => {
    const date = format(parseISO(trade.timestamp), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + (trade.pnl || 0);
    return acc;
  }, {} as Record<string, number>);

  const last30Days = Array.from({ length: 30 }, (_, i) => 
    format(subDays(new Date(), i), 'yyyy-MM-dd')
  ).reverse();

  const pnlChartData = {
    labels: last30Days,
    datasets: [{
      label: 'Daily PnL',
      data: last30Days.map(date => dailyPnL[date] || 0),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  const tradeTypeData = {
    labels: ['Winning Trades', 'Losing Trades'],
    datasets: [{
      data: [profitableTrades.length, lossTrades.length],
      backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
    }],
  };

  const volumeData = {
    labels: data.marketData.slice(-24).map(d => format(parseISO(d.timestamp), 'HH:mm')),
    datasets: [{
      label: 'Volume',
      data: data.marketData.slice(-24).map(d => d.volume),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }],
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Detailed analysis of your trading performance
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Win Rate"
          value={`${winRate.toFixed(2)}%`}
          subValue={`${profitableTrades.length} winning trades`}
          icon={TrendingUp}
          trend={winRate > 50 ? 1 : -1}
        />
        <StatCard
          title="Total PnL"
          value={`${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}%`}
          subValue="Cumulative return"
          icon={BarChart2}
          trend={totalPnL >= 0 ? 1 : -1}
        />
        <StatCard
          title="Avg Trade Size"
          value={`$${avgTradeSize.toFixed(2)}`}
          subValue={`${trades.length} total trades`}
          icon={Activity}
        />
        <StatCard
          title="Last Trade"
          value={trades[0]?.pnl ? `${trades[0].pnl >= 0 ? '+' : ''}${trades[0].pnl.toFixed(2)}%` : 'N/A'}
          subValue={format(parseISO(trades[0]?.timestamp || new Date().toISOString()), 'PPp')}
          icon={Calendar}
          trend={trades[0]?.pnl && trades[0].pnl >= 0 ? 1 : -1}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Performance History</h3>
          <div className="h-[300px]">
            <Line
              data={pnlChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Trade Distribution</h3>
          <div className="h-[300px]">
            <Pie
              data={tradeTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Volume Analysis */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">24h Volume Analysis</h3>
        <div className="h-[300px]">
          <Bar
            data={volumeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
}
