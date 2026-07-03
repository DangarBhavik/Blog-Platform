"use client";

import { AuthProvider } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/user/useCurrentUser";

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <AuthProvider
      user={user ?? null}
      isLoading={isLoading}
    >
      {children}
    </AuthProvider>
  );
}