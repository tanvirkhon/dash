export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'admin' | 'user';
};

// Mock authenticated user for development
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  image: 'https://avatars.githubusercontent.com/u/1234567',
  role: 'admin',
};

export async function getUser(): Promise<User | null> {
  // Always return mock user for now
  return MOCK_USER;
}