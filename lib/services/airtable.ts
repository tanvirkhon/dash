import Airtable from 'airtable';
import { Trade, TradingMetrics } from '../types/trading';

if (!process.env.NEXT_PUBLIC_AIRTABLE_API_KEY) {
  throw new Error('NEXT_PUBLIC_AIRTABLE_API_KEY is not defined');
}

// Configure Airtable with your specific base
const airtable = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
  endpointUrl: 'https://api.airtable.com',
});

const base = airtable.base('appkKeU8fnFBOzqCc');

export async function createTrade(tradeData: Partial<Trade>) {
  try {
    const records = await base('Trading Bot').create([
      {
        fields: {
          ...tradeData,
        },
      },
    ]);
    return records;
  } catch (error) {
    console.error('Error creating trade in Airtable:', error);
    throw error;
  }
}

export async function fetchTradingData(): Promise<{ trades: Trade[], metrics: TradingMetrics }> {
  try {
    return new Promise((resolve, reject) => {
      let records: any[] = [];
      
      base('Trading Bot')
        .select({
          maxRecords: 100,
          sort: [{ field: 'Timestamp', direction: 'desc' }],
          filterByFormula: 'NOT({Timestamp} = "")'
        })
        .eachPage(
          function page(pageRecords, fetchNextPage) {
            records = [...records, ...pageRecords];
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error('Error fetching from Airtable:', err);
              return reject(err);
            }

            if (!records || records.length === 0) {
              return reject(new Error('No trading data available'));
            }

            const trades = records.map(record => ({
              timestamp: record.get('Timestamp') as string,
              symbol: record.get('Symbol') as string,
              closePrice: record.get('Close Price') as number,
              position: record.get('Position') as string,
              entryPrice: record.get('Entry Price') as number,
              pnlPercentage: record.get('PNL Percentage') as number,
              cumulativeROI: record.get('Cumulative ROI') as number,
            }));

            const latestRecord = records[0];
            const metrics: TradingMetrics = {
              winRate: latestRecord.get('Win Rate') as number,
              totalTrades: latestRecord.get('Total Trades') as number,
              accountValue: latestRecord.get('Account Value') as number,
              stopLoss: latestRecord.get('Stop Loss') as number,
              largestWin: latestRecord.get('Largest Win') as number,
              largestLoss: latestRecord.get('Largest Loss') as number,
              averageWin: latestRecord.get('Average Win') as number,
              averageLoss: latestRecord.get('Average Loss') as number,
              profitFactor: parseFloat(latestRecord.get('Profit Factor') as string),
              sharpeRatio: latestRecord.get('Sharpe Ratio') as number,
            };

            resolve({ trades, metrics });
          }
        );
    });
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    throw error;
  }
}