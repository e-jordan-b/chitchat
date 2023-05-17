import { User } from '../models/user-model';
import ApiService from './api-service';

class AuthService extends ApiService {
  async signin(
    email: string,
    password: string
  ): Promise<{ user?: User; error?: string }> {
    const { result: user, error } = await this.fetch<User>('auth/signin', {
      body: {
        email,
        password,
      },
      method: 'POST',
      withCredentials: true,
    });

    return { user, error };
  }

  async signout (): Promise<{ error?: string }> {
    const { error } = await this.fetch('auth/signout', {
      method: 'POST',
      withCredentials: true,
    });

    return { error };
  }
}

export default AuthService;
