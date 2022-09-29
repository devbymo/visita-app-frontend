import { createContext } from 'react';

export const AuthContext = createContext({
  userId: null,
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});
