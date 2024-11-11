"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trade } from "@/lib/types/trading";
import { formatCurrency, formatPercentage } from "@/lib/utils/format";

interface TradesTableProps {
  trades: Trade[];
}

export function TradesTable({ trades }: TradesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Close Price</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">P&L</TableHead>
            <TableHead className="text-right">Net P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, index) => {
            const pnlAmount = (trade.closePrice - trade.entryPrice) * trade.accountValue;
            
            return (
              <TableRow key={index}>
                <TableCell>{new Date(trade.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>{trade.symbol}</TableCell>
                <TableCell>{trade.position}</TableCell>
                <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                <TableCell>{formatCurrency(trade.closePrice)}</TableCell>
                <TableCell>{formatCurrency(trade.accountValue)}</TableCell>
                <TableCell className={`text-right ${trade.pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(trade.pnlPercentage)}
                </TableCell>
                <TableCell className={`text-right ${pnlAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(pnlAmount)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}