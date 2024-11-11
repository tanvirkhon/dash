import { Trade } from "@/lib/types/trading";
import { formatCurrency, formatPercentage } from "./format";

export function downloadTradesCSV(trades: Trade[]) {
  // CSV Headers
  const headers = [
    "Date",
    "Symbol",
    "Position",
    "Entry Price",
    "Close Price",
    "Size",
    "P&L %",
    "Net P&L",
    "Account Value",
    "Cumulative ROI"
  ];

  // Convert trades to CSV rows
  const rows = trades.map(trade => {
    const pnlAmount = (trade.closePrice - trade.entryPrice) * trade.accountValue;
    
    return [
      new Date(trade.timestamp).toISOString().split('T')[0],
      trade.symbol,
      trade.position,
      trade.entryPrice.toFixed(2),
      trade.closePrice.toFixed(2),
      trade.accountValue.toFixed(2),
      trade.pnlPercentage.toFixed(2),
      pnlAmount.toFixed(2),
      trade.accountValue.toFixed(2),
      trade.cumulativeROI.toFixed(2)
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `trading_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}