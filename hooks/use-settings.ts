import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  provider: string;
  apiKey: string;
  model: string;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

const getDefaultApiKey = (provider: string) => {
  if (provider === 'openai') {
    return process.env.NEXT_PUBLIC_K2_API_KEY || '';
  }
  return process.env.NEXT_PUBLIC_CLAUDE_API_KEY || '';
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        provider: 'openai',
        apiKey: getDefaultApiKey('openai'),
        model: 'gpt-4',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
            apiKey: newSettings.provider 
              ? getDefaultApiKey(newSettings.provider)
              : state.settings.apiKey,
          },
        })),
    }),
    {
      name: 'ai-settings',
    }
  )
); 