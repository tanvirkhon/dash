import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { auth, sheets } from '@/lib/server/google-sheets-config';

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:Z',
    });

    return NextResponse.json({
      success: true,
      data: response.data.values
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}
