export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trade_data: {
        Row: {
          id: number
          timestamp: string
          symbol: string
          current_price: number
          position_type: string
          entry_price: number | null
          pnl_percent: number | null
          cumulative_roi: number
          account_value: number
          trailing_stop: number | null
          created_at: string
        }
        Insert: {
          id?: number
          timestamp: string
          symbol: string
          current_price: number
          position_type: string
          entry_price?: number | null
          pnl_percent?: number | null
          cumulative_roi: number
          account_value: number
          trailing_stop?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          timestamp?: string
          symbol?: string
          current_price?: number
          position_type?: string
          entry_price?: number | null
          pnl_percent?: number | null
          cumulative_roi?: number
          account_value?: number
          trailing_stop?: number | null
          created_at?: string
        }
      }
      market_data: {
        Row: {
          id: number
          timestamp: string
          symbol: string
          open: number
          high: number
          low: number
          close: number
          volume: number
          ema1: number
          ema2: number
          hma: number
          rsi: number
          created_at: string
        }
        Insert: {
          id?: number
          timestamp: string
          symbol: string
          open: number
          high: number
          low: number
          close: number
          volume: number
          ema1: number
          ema2: number
          hma: number
          rsi: number
          created_at?: string
        }
        Update: {
          id?: number
          timestamp?: string
          symbol?: string
          open?: number
          high?: number
          low?: number
          close?: number
          volume?: number
          ema1?: number
          ema2?: number
          hma?: number
          rsi?: number
          created_at?: string
        }
      }
      trade_history: {
        Row: {
          id: number
          timestamp: string
          symbol: string
          position_type: string
          entry_price: number
          exit_price: number
          pnl_percent: number
          account_value: number
          created_at: string
        }
        Insert: {
          id?: number
          timestamp: string
          symbol: string
          position_type: string
          entry_price: number
          exit_price: number
          pnl_percent: number
          account_value: number
          created_at?: string
        }
        Update: {
          id?: number
          timestamp?: string
          symbol?: string
          position_type?: string
          entry_price?: number
          exit_price?: number
          pnl_percent?: number
          account_value?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier access
export type TradeData = Database['public']['Tables']['trade_data']['Row']
export type MarketData = Database['public']['Tables']['market_data']['Row']
export type TradeHistory = Database['public']['Tables']['trade_history']['Row']
