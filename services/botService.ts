import axios from 'axios';

const API_BASE_URL = 'http://167.86.79.2:5000';

export interface BotStatus {
  enabled: boolean;
  leverage: number;
}

export const botService = {
  checkStatus: async (): Promise<BotStatus> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bot/status`);
      return {
        enabled: response.data.enabled,
        leverage: response.data.leverage
      };
    } catch (error) {
      console.error('Error checking bot status:', error);
      throw error;
    }
  },

  turnOn: async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bot/toggle/on`);
      return response.data.enabled;
    } catch (error) {
      console.error('Error turning bot on:', error);
      throw error;
    }
  },

  turnOff: async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bot/toggle/off`);
      return !response.data.enabled;
    } catch (error) {
      console.error('Error turning bot off:', error);
      throw error;
    }
  }
};
