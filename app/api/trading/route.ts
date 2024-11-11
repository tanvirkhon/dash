import { NextResponse } from 'next/server';
import { fetchTradingData } from '@/lib/services/airtable';

export async function GET() {
  try {
    const data = await fetchTradingData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Trading API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trading data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 