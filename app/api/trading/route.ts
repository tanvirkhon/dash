import { NextResponse } from 'next/server';
import { sheets } from '@/lib/server/google-sheets-config';
import { Trade, TradingMetrics } from '@/lib/types/trading';

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not configured');
    }
    
    const range = 'Sheet1!A2:R';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in spreadsheet');
    }

    // Debug logs
    console.log('Total rows:', rows.length);
    console.log('Last 5 rows:', rows.slice(-5));

    // Get the latest row
    const latestRow = rows[rows.length - 1];
    console.log('Latest row:', latestRow);
    console.log('Latest close price:', latestRow[2]); // Column C
    console.log('Latest position:', latestRow[3]);    // Column D
    console.log('Latest entry price:', latestRow[4]); // Column E

    // Find the most recent active position
    const activePositionRow = [...rows].reverse().find(row => 
      row[3]?.trim() === 'Long' || row[3]?.trim() === 'Short'
    );
    console.log('Active position row:', activePositionRow);

    const currentState = {
      position: latestRow[3]?.trim() || 'None',
      entryPrice: parseFloat(latestRow[4]) || 0,
      currentPrice: parseFloat(latestRow[2]) || 0, // Using latest close price
      lastPnL: parseFloat(latestRow[5]) || 0,
    };

    console.log('Current state:', currentState);

    const trades = rows.map((row) => ({
      timestamp: new Date(row[0]).toISOString(),
      symbol: 'SOL',
      position: row[3]?.trim() || 'None',
      entryPrice: parseFloat(row[4]) || 0,
      closePrice: parseFloat(row[2]) || 0,
      pnlPercentage: parseFloat(row[5]) || 0,
      cumulativeROI: parseFloat(row[6]) || 0,
      accountValue: parseFloat(row[9]) || 0,
    }));

    const metrics = {
      accountValue: parseFloat(rows[rows.length - 1][9]) || 0,
      totalTrades: parseInt(rows[rows.length - 1][8]) || 0,
      winRate: parseFloat(rows[rows.length - 1][7]) || 0,
      averageWin: parseFloat(rows[rows.length - 1][13]) || 0,
      averageLoss: parseFloat(rows[rows.length - 1][14]) || 0,
      largestWin: parseFloat(rows[rows.length - 1][11]) || 0,
      largestLoss: parseFloat(rows[rows.length - 1][12]) || 0,
      profitFactor: parseFloat(rows[rows.length - 1][15]) || 0,
      sharpeRatio: parseFloat(rows[rows.length - 1][16]) || 0,
      stopLoss: 2.5,
    };

    return NextResponse.json({ 
      trades,
      metrics,
      currentState,
    });

  } catch (error) {
    console.error('Full error details:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trading data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        errorObject: error
      },
      { status: 500 }
    );
  }
} 