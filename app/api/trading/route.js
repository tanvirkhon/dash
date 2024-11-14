import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a JWT client
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Authorize the client
    await jwt.authorize();

    // Create the sheets instance
    const sheets = google.sheets('v4');

    // Get the data
    const result = await sheets.spreadsheets.values.get({
      auth: jwt,
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:Z',  // Adjust this range to match your sheet
    });

    // Return the data
    return NextResponse.json(result.data);

  } catch (error) {
    console.error('Error details:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
