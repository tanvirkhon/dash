import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

if (!process.env.GOOGLE_PRIVATE_KEY) {
  console.error('GOOGLE_PRIVATE_KEY is not set');
}

const credentials = {
  type: "service_account",
  project_id: "tradingbotproject-433620",
  private_key_id: "5f788ce68764893d3cdca4f46240334ba7643add",
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: "trading-bot-service@tradingbotproject-433620.iam.gserviceaccount.com",
  client_id: "111102861704110178803",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/trading-bot-service%40tradingbotproject-433620.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

console.log('Initializing Google Sheets with credentials:', {
  projectId: credentials.project_id,
  clientEmail: credentials.client_email,
  hasPrivateKey: !!credentials.private_key,
});

export const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

export const sheets = google.sheets({ version: 'v4', auth }); 