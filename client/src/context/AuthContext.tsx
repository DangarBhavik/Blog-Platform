"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";

export type User =  {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  user: User | null;
  isLoading: boolean;
}

export function AuthProvider({
  children,
  user,
  isLoading,
}: AuthProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}