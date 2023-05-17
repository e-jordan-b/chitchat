import { createContext } from 'react';

import { User } from '../models/user-model';

export const UserContext = createContext<{
  user: User | undefined;
  update: (user: User | undefined) => void;
}>({ user: undefined, update: () => {} });
