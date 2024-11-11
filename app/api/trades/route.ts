import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';
import { Trade } from '@/lib/types/trading';

// In-memory storage for trades (replace with your database solution)
let trades: Trade[] = [];

export async function GET(request: NextRequest) {
  try {
    // Calculate metrics from stored trades
    const metrics = calculateMetrics(trades);

    return NextResponse.json({
      trades,
      metrics
    });
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function calculateMetrics(trades: Trade[]) {
  if (trades.length === 0) {
    return {
      winRate: 0,
      totalTrades: 0,
      accountValue: 0,
      stopLoss: 2.5,
      largestWin: 0,
      largestLoss: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0
    };
  }

  const winningTrades = trades.filter(t => t.pnlPercentage > 0);
  const losingTrades = trades.filter(t => t.pnlPercentage < 0);

  return {
    winRate: (winningTrades.length / trades.length) * 100,
    totalTrades: trades.length,
    accountValue: trades[trades.length - 1].accountValue,
    stopLoss: 2.5,
    largestWin: Math.max(...trades.map(t => t.pnlPercentage)),
    largestLoss: Math.min(...trades.map(t => t.pnlPercentage)),
    averageWin: winningTrades.length ? 
      winningTrades.reduce((sum, t) => sum + t.pnlPercentage, 0) / winningTrades.length : 0,
    averageLoss: losingTrades.length ?
      losingTrades.reduce((sum, t) => sum + t.pnlPercentage, 0) / losingTrades.length : 0,
    profitFactor: trades[trades.length - 1].profitFactor,
    sharpeRatio: trades[trades.length - 1].sharpeRatio
  };
}