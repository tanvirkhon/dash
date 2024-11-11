import { NextResponse } from 'next/server';
import { createTrade } from '@/lib/services/airtable';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createTrade(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}