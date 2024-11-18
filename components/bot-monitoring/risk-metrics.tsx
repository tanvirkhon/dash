import { Card } from "@/components/ui/card";
import { TradingMetrics } from "@/lib/types/trading";
import { TradeData } from "@/lib/types/supabase";
import { formatPercentage } from "@/lib/utils/format";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp, AlertTriangle, Activity } from "lucide-react";

interface RiskMetricsProps {
  metrics: TradingMetrics;
  trades: TradeData[];
}

export function RiskMetrics({ metrics, trades }: RiskMetricsProps) {
  // Calculate risk metrics
  const recentTrades = trades.slice(0, 20); // Last 20 trades
  const recentVolatility = calculateVolatility(recentTrades);
  const maxDrawdown = calculateMaxDrawdown(trades);
  const riskLevel = calculateRiskLevel(metrics, recentVolatility);
  const profitFactor = metrics.profitFactor;

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Level</span>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
            <AlertTriangle className={`h-4 w-4 ${getRiskColor(riskLevel)}`} />
          </div>
        </div>
        <Progress value={getRiskPercentage(riskLevel)} className="h-2" />
      </div>

      <div className="grid gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Profit Factor</p>
              <p className="text-2xl font-bold">{profitFactor.toFixed(2)}</p>
            </div>
            {profitFactor >= 1.5 ? (
              <TrendingUp className="h-8 w-8 text-green-500" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Ratio of gross profit to gross loss. Above 1.5 is considered good.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Max Drawdown</p>
              <p className="text-2xl font-bold">{formatPercentage(maxDrawdown)}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Largest peak-to-trough decline in account value.
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Volatility (20-trade)</p>
              <p className="text-2xl font-bold">{formatPercentage(recentVolatility)}</p>
            </div>
            <Activity className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Standard deviation of returns over the last 20 trades.
          </p>
        </Card>
      </div>
    </div>
  );
}

function calculateVolatility(trades: TradeData[]): number {
  const returns = trades
    .filter(t => t.pnl_percent !== null)
    .map(t => t.pnl_percent || 0);
  
  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function calculateMaxDrawdown(trades: TradeData[]): number {
  let peak = -Infinity;
  let maxDrawdown = 0;
  
  trades.forEach(trade => {
    if (trade.account_value > peak) {
      peak = trade.account_value;
    }
    
    const drawdown = ((peak - trade.account_value) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown;
}

function calculateRiskLevel(metrics: TradingMetrics, volatility: number): string {
  if (metrics.sharpeRatio > 2 && volatility < 5) return "Low";
  if (metrics.sharpeRatio > 1 && volatility < 10) return "Moderate";
  if (metrics.sharpeRatio < 0.5 || volatility > 15) return "High";
  return "Moderate";
}

function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "Low":
      return "text-green-500";
    case "Moderate":
      return "text-yellow-500";
    case "High":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function getRiskPercentage(riskLevel: string): number {
  switch (riskLevel) {
    case "Low":
      return 33;
    case "Moderate":
      return 66;
    case "High":
      return 100;
    default:
      return 50;
  }
}