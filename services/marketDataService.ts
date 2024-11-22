import axios from 'axios';

const API_BASE_URL = 'http://167.86.79.2:5000';

export interface MarketStats {
  '24h_high': number;
  '24h_low': number;
  '24h_volume': number;
  volatility: number;
}

export interface Position {
  current_pnl: number;
  entry_price: number;
  highest_price: number;
  is_open: boolean;
  trailing_stop: number;
}

export interface Indicators {
  ema1: number;
  ema2: number;
  hma: number;
  rsi: number;
}

export interface MarketData {
  account_value: number;
  current_price: number;
  indicators: Indicators;
  market_stats: MarketStats;
  position: Position;
}

export interface MarketDataResponse {
  last_update: number;
  market_data: MarketData;
}

export const marketDataService = {
  getMarketData: async (): Promise<MarketDataResponse> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/market-data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }
};
