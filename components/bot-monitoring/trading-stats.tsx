import { Card } from "@/components/ui/card";
import { TradingMetrics } from "@/lib/types/trading";
import { TradeData } from "@/lib/types/supabase";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TradingStatsProps {
  trades: TradeData[];
  metrics: TradingMetrics;
}

export function TradingStats({ trades, metrics }: TradingStatsProps) {
  // Get the last 10 trades
  const recentTrades = trades
    .filter(trade => trade.pnl_percent !== null)
    .slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Profit Factor</h4>
          <div className="text-2xl font-bold">{metrics.profitFactor.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Ratio of wins to losses</p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Sharpe Ratio</h4>
          <div className="text-2xl font-bold">{metrics.sharpeRatio.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Risk-adjusted return</p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Win</h4>
          <div className="text-2xl font-bold text-green-500">
            {formatPercentage(metrics.averageWin)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Mean winning trade</p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Average Loss</h4>
          <div className="text-2xl font-bold text-red-500">
            {formatPercentage(metrics.averageLoss)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Mean losing trade</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Recent Trades</h3>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-right">Entry Price</TableHead>
                <TableHead className="text-right">Exit Price</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Account Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">
                    {new Date(trade.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>{trade.position_type}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(trade.entry_price || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(trade.current_price)}
                  </TableCell>
                  <TableCell className={`text-right ${
                    trade.pnl_percent && trade.pnl_percent > 0 
                      ? 'text-green-500' 
                      : trade.pnl_percent && trade.pnl_percent < 0 
                        ? 'text-red-500' 
                        : ''
                  }`}>
                    {formatPercentage(trade.pnl_percent || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(trade.account_value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}