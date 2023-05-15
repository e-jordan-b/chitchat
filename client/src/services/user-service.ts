import { User } from '../models/user-model';
import ApiService from './api-service';

class UserService extends ApiService {
  async fetchUser(): Promise<{ user?: User; error?: string }> {
    const { result: user, error } = await this.fetch<User>('user/', {
      method: 'GET',
      withCredentials: true,
    });

    if (error) {
      return { error };
    }

    return { user };
  }
}

export default UserService;
