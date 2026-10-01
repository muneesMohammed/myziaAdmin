"use client";

import { createContext, useContext } from "react";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosInstance";

export type UserRole = "admin" | "super_admin" | "staff" | "cashier";

type UserProfile = {
  name: string | null;
  image_url: string | null;
  role: UserRole | null;
};

type UserContextType = {
  user: { id: string; email: string; name: string; role: UserRole } | null;
  profile: UserProfile | null;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: user } = await axiosInstance.get("/auth/me");
      return {
        user,
        profile: {
          name: user.name,
          image_url: null,
          role: user.role as UserRole,
        } as UserProfile,
      };
    },
    staleTime: Infinity,
    retry: false,
  });

  const value = {
    user: data?.user ?? null,
    profile: data?.profile ?? null,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
