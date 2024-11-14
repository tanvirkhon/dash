import { TradingData } from '@/lib/types/trading';

export async function fetchTradingData(): Promise<TradingData> {
  const response = await fetch('/api/trading');
  if (!response.ok) {
    throw new Error('Failed to fetch trading data');
  }
  return response.json();
} 