"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, DollarSign, Calculator, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { TradesTable } from "./trades-table";
import { TaxSummary } from "./tax-summary";
import { MonthlyReport } from "./monthly-report";
import { fetchTradingData } from "@/lib/services/airtable";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { downloadTradesCSV } from "@/lib/utils/export";
import { Trade } from "@/lib/types/trading";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";

export default function AccountingDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchTradingData();
        setTrades(data.trades);
      } catch (error) {
        console.error('Error fetching trading data:', error);
        toast.error("Failed to fetch trading data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    // Update every minute
    const interval = setInterval(loadData, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate tax metrics
  const yearTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.timestamp);
    return tradeDate.getFullYear() === selectedYear;
  });

  const profitableTrades = yearTrades.filter(t => t.pnlPercentage > 0);
  const totalProfit = profitableTrades.reduce((sum, t) => sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);
  const lossTrades = yearTrades.filter(t => t.pnlPercentage < 0);
  const totalLoss = lossTrades.reduce((sum, t) => sum + (t.closePrice - t.entryPrice) * t.accountValue, 0);
  const netPnL = totalProfit + totalLoss;

  // Estimate taxes (simplified calculation)
  const estimatedTax = netPnL > 0 ? netPnL * 0.25 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Accounting & Taxes</h2>
          <p className="text-muted-foreground">
            Track your trading performance and tax obligations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => downloadTradesCSV(yearTrades)}>
            <Download className="w-4 h-4 mr-2" /> Export {selectedYear} Trades
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Profit/Loss</h3>
            {netPnL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className={`text-2xl font-bold ${netPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(netPnL)}
          </div>
          <p className="text-xs text-muted-foreground">
            For tax year {selectedYear}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Estimated Tax</h3>
            <Calculator className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(estimatedTax)}</div>
          <p className="text-xs text-muted-foreground">
            Based on current profit
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Trades</h3>
            <FileText className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{yearTrades.length}</div>
          <p className="text-xs text-muted-foreground">
            In tax year {selectedYear}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold">
            {formatPercentage(profitableTrades.length / yearTrades.length * 100)}
          </div>
          <p className="text-xs text-muted-foreground">
            Profitable trades ratio
          </p>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Tax Summary</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="trades">Trade History</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card className="p-6">
            <TaxSummary trades={yearTrades} year={selectedYear} />
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="p-6">
            <MonthlyReport trades={yearTrades} year={selectedYear} />
          </Card>
        </TabsContent>

        <TabsContent value="trades">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6">Trade History</h3>
            <TradesTable trades={yearTrades} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}