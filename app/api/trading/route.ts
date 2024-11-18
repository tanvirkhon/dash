import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/supabase';

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET() {
  try {
    // Fetch latest trades
    const { data: tradeData, error: tradeError } = await supabase
      .from('trade_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (tradeError) throw tradeError;
    if (!tradeData || tradeData.length === 0) {
      return NextResponse.json({ error: 'No trading data found' }, { status: 404 });
    }

    // Fetch market data
    const { data: marketData, error: marketError } = await supabase
      .from('market_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (marketError) throw marketError;

    // Calculate metrics
    const winningTrades = tradeData.filter(t => t.pnl_percent && t.pnl_percent > 0);
    const losingTrades = tradeData.filter(t => t.pnl_percent && t.pnl_percent < 0);
    const winRate = (winningTrades.length / tradeData.filter(t => t.pnl_percent !== null).length) * 100;

    const metrics = {
      accountValue: tradeData[0].account_value,
      totalTrades: tradeData.filter(t => t.pnl_percent !== null).length,
      winRate,
      averageWin: winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + (t.pnl_percent || 0), 0) / winningTrades.length
        : 0,
      averageLoss: losingTrades.length > 0
        ? losingTrades.reduce((sum, t) => sum + (t.pnl_percent || 0), 0) / losingTrades.length
        : 0,
      largestWin: Math.max(...tradeData.filter(t => t.pnl_percent !== null).map(t => t.pnl_percent || 0)),
      largestLoss: Math.min(...tradeData.filter(t => t.pnl_percent !== null).map(t => t.pnl_percent || 0)),
      profitFactor: calculateProfitFactor(tradeData),
      sharpeRatio: calculateSharpeRatio(tradeData),
      stopLoss: tradeData[0].trailing_stop || 2.5,
    };

    return NextResponse.json({
      trades: tradeData,
      marketData: marketData || [],
      metrics,
    });

  } catch (error) {
    console.error('Error fetching trading data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch trading data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateProfitFactor(trades: Database['public']['Tables']['trade_data']['Row'][]): number {
  const totalProfit = trades
    .filter(t => t.pnl_percent && t.pnl_percent > 0)
    .reduce((sum, t) => sum + (t.pnl_percent || 0), 0);
  
  const totalLoss = Math.abs(
    trades
      .filter(t => t.pnl_percent && t.pnl_percent < 0)
      .reduce((sum, t) => sum + (t.pnl_percent || 0), 0)
  );

  return totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
}

function calculateSharpeRatio(trades: Database['public']['Tables']['trade_data']['Row'][]): number {
  const validTrades = trades.filter(t => t.pnl_percent !== null);
  if (validTrades.length === 0) return 0;

  const returns = validTrades.map(t => t.pnl_percent || 0);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
}