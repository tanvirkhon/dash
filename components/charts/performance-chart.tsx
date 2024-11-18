import { Card } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils/format";
import { TradeData } from "@/lib/types/supabase";

interface PerformanceChartProps {
  data: TradeData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Format data for the chart
  const chartData = data
    .filter(trade => trade.account_value !== null)
    .map(trade => ({
      timestamp: new Date(trade.timestamp).getTime(),
      value: trade.account_value || 0,
      pnl: trade.pnl_percent || 0,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="timestamp"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={(timestamp) => {
            return new Date(timestamp).toLocaleDateString();
          }}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(value) => formatCurrency(value)}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <Card className="p-2 !bg-background border shadow-lg">
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Value
                      </span>
                      <span className="font-bold">
                        {formatCurrency(data.value)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Change
                      </span>
                      <span className={`font-bold ${data.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data.pnl >= 0 ? '+' : ''}{data.pnl.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Date
                      </span>
                      <span className="font-bold">
                        {new Date(data.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          fillOpacity={1}
          fill="url(#colorValue)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}