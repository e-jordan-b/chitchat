import { createContext } from 'react';

import { User } from '../models/user-model';

export const UserContext = createContext<{
  user: User | undefined;
  update: (user: User) => void;
}>({ user: undefined, update: () => {} });
