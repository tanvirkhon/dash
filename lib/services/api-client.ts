import { AIRTABLE_CONFIG } from '@/lib/config/airtable';

export class APIClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `${AIRTABLE_CONFIG.baseUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`;
    this.headers = {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async get<T>(params: string = ''): Promise<T> {
    try {
      const url = `${this.baseUrl}${params}`;
      const response = await fetch(url, {
        headers: this.headers,
        cache: 'no-store'
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(error)}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post<T>(data: any): Promise<T> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(error)}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}