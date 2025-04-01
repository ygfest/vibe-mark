"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
function LogOutButton() {
  const { theme } = useTheme();
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <Button
      className="fixed top-4 right-16 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-1 border-zinc-300 dark:border-zinc-500"
      onClick={() => {
        setIsSigningOut(true);
        signOut().finally(() => setIsSigningOut(false));
      }}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <Loader2
          className={`ml-2 h-4 w-4 animate-spin ${
            theme === "dark" ? "text-zinc-50" : "text-zinc-950"
          }`}
        />
      ) : (
        <LogOut
          className={`${theme === "dark" ? "text-zinc-50" : "text-zinc-950"}`}
        />
      )}
    </Button>
  );
}

export default LogOutButton;
