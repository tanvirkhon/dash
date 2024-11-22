import axios from 'axios';

const BOT_API_URL = process.env.NEXT_PUBLIC_BOT_API_URL;

export const botControlService = {
  async getBotStatus(): Promise<{ success: boolean; status: string; message?: string }> {
    try {
      console.log('Fetching status from:', `${BOT_API_URL}/status`);
      const response = await axios.get(`${BOT_API_URL}/status`);
      console.log('Raw status response:', response.data);

      // Handle the enabled field from the API
      if (typeof response.data.enabled === 'boolean') {
        return {
          success: true,
          status: response.data.enabled ? 'active' : 'inactive'
        };
      }

      // Fallback to other status formats
      const status = response.data.status || response.data.state || 'unknown';
      return {
        success: true,
        status: status.toLowerCase()
      };
    } catch (error) {
      console.error('Error getting bot status:', error);
      return {
        success: false,
        status: 'unknown',
        message: error.response?.data?.message || 'Failed to get bot status'
      };
    }
  },

  async toggleBot(state: boolean): Promise<{ success: boolean; message: string }> {
    try {
      // Using the GET endpoints for toggle
      const endpoint = state ? '/bot/toggle/on' : '/bot/toggle/off';
      console.log('Toggling bot using endpoint:', `${BOT_API_URL}${endpoint}`);
      
      const response = await axios.get(`${BOT_API_URL}${endpoint}`);
      console.log('Raw toggle response:', response.data);
      
      // Check if the toggle was successful by verifying the enabled state
      if (response.data && typeof response.data.enabled === 'boolean') {
        const success = response.data.enabled === state;
        return {
          success,
          message: success 
            ? `Bot successfully ${state ? 'activated' : 'deactivated'}`
            : `Failed to ${state ? 'activate' : 'deactivate'} bot`
        };
      }
      
      return {
        success: true,
        message: `Bot successfully ${state ? 'activated' : 'deactivated'}`
      };
    } catch (error) {
      console.error('Error toggling bot:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to toggle bot state'
      };
    }
  }
};
