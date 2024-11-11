import { NOTION_CONFIG } from '@/lib/config/notion';
import { Trade, TradingMetrics, TradingData } from '@/lib/types/trading';

export async function fetchNotionData(): Promise<TradingData> {
  try {
    const response = await fetch(`${NOTION_CONFIG.baseUrl}/databases/${NOTION_CONFIG.databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
        'Notion-Version': NOTION_CONFIG.version,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: 'Timestamp', direction: 'descending' }],
        page_size: 100,
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    const trades = parseTrades(data.results);
    const metrics = calculateMetrics(trades);

    return { trades, metrics };
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    throw error;
  }
}

export async function createTrade(trade: Partial<Trade>): Promise<Trade> {
  try {
    const response = await fetch(`${NOTION_CONFIG.baseUrl}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_CONFIG.apiKey}`,
        'Notion-Version': NOTION_CONFIG.version,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_CONFIG.databaseId },
        properties: {
          'Timestamp': { 
            type: 'rich_text',
            rich_text: [{ text: { content: trade.timestamp || new Date().toISOString() } }]
          },
          'Symbol': {
            type: 'select',
            select: { name: trade.symbol || 'SOL' }
          },
          'Position': {
            type: 'select',
            select: { name: trade.position || 'None' }
          },
          'Close Price': {
            type: 'number',
            number: trade.closePrice || 0
          },
          'Entry Price': {
            type: 'number',
            number: trade.entryPrice || 0
          },
          'PNL Percentage': {
            type: 'number',
            number: trade.pnlPercentage || 0
          },
          'Cumulative ROI': {
            type: 'number',
            number: trade.cumulativeROI || 0
          },
          'Account Value': {
            type: 'number',
            number: trade.accountValue || 0
          },
          'Profit Factor': {
            type: 'number',
            number: trade.profitFactor || 1
          },
          'Sharpe Ratio': {
            type: 'number',
            number: trade.sharpeRatio || 0
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create trade in Notion: ${response.status}`);
    }

    const result = await response.json();
    return parseTrade(result);
  } catch (error) {
    console.error('Error creating trade in Notion:', error);
    throw error;
  }
}

function parseTrades(results: any[]): Trade[] {
  return results.map(parseTrade);
}

function parseTrade(result: any): Trade {
  const props = result.properties;
  return {
    id: result.id,
    timestamp: props.Timestamp?.rich_text[0]?.text?.content || new Date().toISOString(),
    symbol: props.Symbol?.select?.name || 'SOL',
    position: props.Position?.select?.name || 'None',
    closePrice: props['Close Price']?.number || 0,
    entryPrice: props['Entry Price']?.number || 0,
    pnlPercentage: props['PNL Percentage']?.number || 0,
    cumulativeROI: props['Cumulative ROI']?.number || 0,
    accountValue: props['Account Value']?.number || 0,
    equity: props['Account Value']?.number || 0,
    drawdown: props['Average Loss']?.number || 0,
    profitFactor: props['Profit Factor']?.number || 1,
    sharpeRatio: props['Sharpe Ratio']?.number || 0
  };
}

function calculateMetrics(trades: Trade[]): TradingMetrics {
  if (!trades.length) {
    return {
      winRate: 0,
      totalTrades: 0,
      accountValue: 0,
      stopLoss: 2.5,
      largestWin: 0,
      largestLoss: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 1,
      sharpeRatio: 0
    };
  }

  const winningTrades = trades.filter(t => t.pnlPercentage > 0);
  const losingTrades = trades.filter(t => t.pnlPercentage < 0);

  return {
    winRate: (winningTrades.length / trades.length) * 100,
    totalTrades: trades.length,
    accountValue: trades[0].accountValue,
    stopLoss: 2.5,
    largestWin: Math.max(...trades.map(t => t.pnlPercentage)),
    largestLoss: Math.min(...trades.map(t => t.pnlPercentage)),
    averageWin: winningTrades.length ? 
      winningTrades.reduce((sum, t) => sum + t.pnlPercentage, 0) / winningTrades.length : 0,
    averageLoss: losingTrades.length ?
      losingTrades.reduce((sum, t) => sum + t.pnlPercentage, 0) / losingTrades.length : 0,
    profitFactor: trades[0].profitFactor,
    sharpeRatio: trades[0].sharpeRatio
  };
}