import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

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

const signInWithCredentials = async (data: SignInData) => {
  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};

// React Query hooks
export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      // Handle successful signup
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: signInWithCredentials,
    onSuccess: () => {
      // Handle successful signin
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: () => signOut(),
  });
};
