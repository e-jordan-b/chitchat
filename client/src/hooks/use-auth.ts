import { useState, useEffect } from 'react';
import { User } from '../models/user-model';
import UserService from '../services/user-service';

export const useAuth = () => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const userService = new UserService();

  const fire = async () => {
    setLoading(true);

    const { user, error } = await userService.fetchUser();

    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    fire();
  }, []);

  return { user, setUser, loading, error, fire };
};
