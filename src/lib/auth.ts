import { useMutation } from "@tanstack/react-query";
import { signIn, signOut, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

// API functions
const signUp = async (data: SignUpData) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to sign up");
  }

  return response.json();
};

// React Query hooks
export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    mutationKey: ["signup"],
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: Error) => {
      console.error("Signup error:", error.message);
    },
  });
};

export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: () => signOut({ redirect: false }),
    mutationKey: ["signout"],
    onSuccess: () => {
      router.push("/sign-in");
    },
  });
};
