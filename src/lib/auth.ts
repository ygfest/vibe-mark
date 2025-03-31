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

const signInWithCredentials = async (
  data: SignInData
): Promise<SignInResponse> => {
  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (!result) {
    throw new Error("No response from sign in");
  }

  if (result.error) {
    throw new Error(result.error);
  }

  return result;
};

// React Query hooks
export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    mutationKey: ["signup"],
    onSuccess: () => {
      router.push("/"); // Redirect to login after successful signup
    },
    onError: (error: Error) => {
      // You might want to show a toast notification here
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
      router.push("/sign-in"); // Redirect to login after signout
    },
  });
};
