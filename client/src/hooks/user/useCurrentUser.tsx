"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/api/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export const useCurrentUser = () => {
  const router = useRouter();
  const pathname = usePathname();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const user = await authService.getCurrentUser();
        return user;
      } catch (error: Error | any) {
        console.error("Error fetching current user:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle redirect after query settles
  useEffect(() => {
    if (query.isLoading) return;

    const isAuthRoute = pathname === "/auth/login" || pathname === "/auth/register";
    const isProtectedRoute = pathname === "/create-post" || pathname.startsWith("/my-posts") || pathname.startsWith("/edit-post");
    const isAuthenticated = query.isSuccess && query.data !== null && query.data !== undefined;

    if (isAuthRoute && isAuthenticated) {
      router.push("/");
    } else if (isProtectedRoute && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [query.isError, query.data, query.isSuccess, query.isLoading, router, pathname]);

  return query;
};