import { User } from '../types/userType'

const baseUrl = 'http://localhost:3001/'

export const fetchUser = async (): Promise<{ user?: User; error?: string }> => {
  const response = await fetch(`${baseUrl}user/`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    return { error: 'Error Fetching User' };
  }

  const user = (await response.json()) as unknown as User;
  return { user };
};