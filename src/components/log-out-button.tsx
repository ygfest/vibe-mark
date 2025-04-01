"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useTheme } from "next-themes";

function LogOutButton() {
  const { theme } = useTheme();

  return (
    <Button
      className="fixed top-4 right-16 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border-1 border-zinc-300 dark:border-zinc-500"
      onClick={() => signOut()}
    >
      {" "}
      <LogOut
        className={`${theme === "dark" ? "text-zinc-50" : "text-zinc-950"}`}
      />
    </Button>
  );
}

export default LogOutButton;
