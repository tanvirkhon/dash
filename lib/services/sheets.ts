import { fetchTradingData as fetchAirtableData } from './airtable';
import { TradingData } from '@/lib/types/trading';

export async function fetchTradingData(): Promise<TradingData> {
  return fetchAirtableData();
}