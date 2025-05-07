"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    planType: string;
    generationsLeft: number;
  };
  isLoading: boolean;
  decrementGenerations: () => void;
  isPlanLimitReached: boolean;
  setIsPlanLimitReached: (value: boolean) => void;
}

const initialUserState = {
  planType: "FREE",
  generationsLeft: 10,
};

const UserContext = createContext<UserContextType>({
  user: initialUserState,
  isLoading: true,
  decrementGenerations: () => {},
  isPlanLimitReached: false,
  setIsPlanLimitReached: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(initialUserState);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanLimitReached, setIsPlanLimitReached] = useState(false);

  // Function to decrement the generations count
  const decrementGenerations = () => {
    setUser((prevUser) => ({
      ...prevUser,
      generationsLeft: Math.max(0, prevUser.generationsLeft - 1),
    }));

    // Check if we've hit the limit
    if (user.generationsLeft <= 1) {
      setIsPlanLimitReached(true);
    }
  };

  // Fetch user data when the session is available
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.user?.email) {
        try {
          setIsLoading(true);
          const res = await fetch("/api/user");
          if (res.ok) {
            const data = await res.json();
            setUser((prev) => ({
              ...prev,
              ...data.user,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else if (status !== "loading") {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [session, status]);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        decrementGenerations,
        isPlanLimitReached,
        setIsPlanLimitReached,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
