import { useState, useEffect, useCallback } from 'react';
import { Trade, TradingMetrics } from "@/lib/types/trading";
import { parseTradeRow, calculateMetrics } from "@/lib/utils/trade-utils";
import { generateMockTrades } from "@/lib/services/mock-data";
import { toast } from "sonner";

interface TradingData {
  trades: Trade[];
  metrics: TradingMetrics;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTradingData(): TradingData {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (retryCount >= 3) {
      const mockTrades = generateMockTrades(30);
      setTrades(mockTrades);
      setMetrics(calculateMetrics(mockTrades));
      setError('Using mock data due to API errors');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // For now, we'll use mock data directly
      const mockTrades = generateMockTrades(30);
      setTrades(mockTrades);
      setMetrics(calculateMetrics(mockTrades));
      setRetryCount(0);
      
    } catch (error) {
      console.error('Error fetching trading data:', error);
      setRetryCount(prev => prev + 1);
      
      if (retryCount < 2) {
        toast.error(`Retrying data fetch (${retryCount + 1}/3)`);
        setTimeout(fetchData, 2000 * (retryCount + 1));
      } else {
        const mockTrades = generateMockTrades(30);
        setTrades(mockTrades);
        setMetrics(calculateMetrics(mockTrades));
        setError('Using mock data');
        toast.error('Using mock trading data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return {
    trades,
    metrics: metrics || calculateMetrics([]),
    isLoading,
    error,
    refetch: fetchData
  };
}