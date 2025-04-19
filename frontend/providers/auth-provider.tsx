'use client';

import { createContext, useContext, useState } from 'react';

type User = {
  id: number;
  email: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User;
}) {
  const [user, setUser] = useState<User>(initialUser);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
