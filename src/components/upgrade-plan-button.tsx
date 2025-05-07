"use client";

import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradePlanButtonProps {
  planType: string;
}

function UpgradePlanButton({ planType }: UpgradePlanButtonProps) {
  // Only show the upgrade button for free tier users
  if (planType !== "FREE") {
    return null;
  }

  return (
    <Link href="/upgrade">
      <Button className="p-2 rounded-lg transition-colors border-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
        <Sparkles className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Upgrade</span>
      </Button>
    </Link>
  );
}

export default UpgradePlanButton;
