import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/supabase';
import axios from 'axios';

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

const K2_API_URL = 'http://167.86.79.2:5000';

export async function GET() {
  try {
    // Fetch K2 Bot market data
    let k2MarketData = null;
    try {
      const response = await axios.get(`${K2_API_URL}/market-data`);
      k2MarketData = response.data;
    } catch (error) {
      console.error('Error fetching K2 market data:', error);
    }

    // Fetch K2 Bot status
    let botStatus = { enabled: false, leverage: 1 };
    try {
      const response = await axios.get(`${K2_API_URL}/bot/status`);
      botStatus = response.data;
    } catch (error) {
      console.error('Error fetching K2 bot status:', error);
    }

    // Fetch latest trades from Supabase
    const { data: tradeData, error: tradeError } = await supabase
      .from('trade_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (tradeError) throw tradeError;

    // Calculate metrics
    const metrics = {
      accountValue: k2MarketData?.market_data?.account_value || 0,
      totalTrades: tradeData?.length || 0,
      winRate: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      stopLoss: k2MarketData?.market_data?.position?.trailing_stop || 0,
      leverage: botStatus.leverage,
      position: {
        isOpen: k2MarketData?.market_data?.position?.is_open || false,
        entryPrice: k2MarketData?.market_data?.position?.entry_price || 0,
        currentPnl: k2MarketData?.market_data?.position?.current_pnl || 0,
        highestPrice: k2MarketData?.market_data?.position?.highest_price || 0
      },
      marketStats: k2MarketData?.market_data?.market_stats || {
        '24h_high': 0,
        '24h_low': 0,
        '24h_volume': 0,
        volatility: 0
      },
      indicators: k2MarketData?.market_data?.indicators || {
        ema1: 0,
        ema2: 0,
        hma: 0,
        rsi: 0
      }
    };

    // If we have trade data, calculate additional metrics
    if (tradeData && tradeData.length > 0) {
      const winningTrades = tradeData.filter(t => t.pnl_percent && t.pnl_percent > 0);
      const losingTrades = tradeData.filter(t => t.pnl_percent && t.pnl_percent < 0);
      
      metrics.winRate = (winningTrades.length / tradeData.filter(t => t.pnl_percent !== null).length) * 100;
      metrics.averageWin = winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + (t.pnl_percent || 0), 0) / winningTrades.length
        : 0;
      metrics.averageLoss = losingTrades.length > 0
        ? losingTrades.reduce((sum, t) => sum + (t.pnl_percent || 0), 0) / losingTrades.length
        : 0;
      metrics.largestWin = Math.max(...tradeData.filter(t => t.pnl_percent !== null).map(t => t.pnl_percent || 0));
      metrics.largestLoss = Math.min(...tradeData.filter(t => t.pnl_percent !== null).map(t => t.pnl_percent || 0));
      metrics.profitFactor = calculateProfitFactor(tradeData);
      metrics.sharpeRatio = calculateSharpeRatio(tradeData);
    }

    return NextResponse.json({
      trades: tradeData || [],
      marketData: k2MarketData,
      metrics,
      botStatus,
      lastUpdate: k2MarketData?.last_update || Date.now()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateProfitFactor(trades: Database['public']['Tables']['trade_data']['Row'][]): number {
  const profits = trades.filter(t => t.pnl_percent && t.pnl_percent > 0).reduce((sum, t) => sum + (t.pnl_percent || 0), 0);
  const losses = Math.abs(trades.filter(t => t.pnl_percent && t.pnl_percent < 0).reduce((sum, t) => sum + (t.pnl_percent || 0), 0));
  return losses === 0 ? profits : profits / losses;
}

function calculateSharpeRatio(trades: Database['public']['Tables']['trade_data']['Row'][]): number {
  if (trades.length < 2) return 0;
  const returns = trades.map(t => t.pnl_percent || 0);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1));
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(365); // Annualized
}