"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import PlanUpgradeModal from "./plan-upgrade-modal";

interface UpgradePlanButtonProps {
  planType: string;
}

function UpgradePlanButton({ planType }: UpgradePlanButtonProps) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show the upgrade button for free tier users
  if (planType !== "FREE") {
    return null;
  }

  return (
    <>
      <Button
        className="fixed top-4 right-24 p-2 rounded-lg transition-colors border-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Upgrade</span>
      </Button>

      <PlanUpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default UpgradePlanButton;
