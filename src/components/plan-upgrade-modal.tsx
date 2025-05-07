"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOutOfGenerations?: boolean;
}

export default function PlanUpgradeModal({
  isOpen,
  onClose,
  isOutOfGenerations = false,
}: PlanUpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-zinc-900">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              {isOutOfGenerations
                ? "You've used all your generations!"
                : "Upgrade Your Plan"}
            </DialogTitle>
            <DialogDescription className="text-white/90 text-center mt-2">
              {isOutOfGenerations
                ? "Upgrade now to continue creating amazing logos"
                : "Unlock more power with our premium plans"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Free Plan */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-2xl font-bold mb-4">$0</p>
            <ul className="space-y-2 flex-grow mb-4">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>10 Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Basic Support</span>
              </li>
            </ul>
            <Button className="w-full mt-auto" variant="outline" disabled>
              Current Plan
            </Button>
          </div>

          {/* Plus Plan */}
          <div className="border-2 border-purple-500 rounded-lg p-4 flex flex-col h-full shadow-lg relative">
            <div className="absolute -top-3 -right-3 bg-purple-500 text-white text-xs py-1 px-2 rounded-full">
              Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Plus</h3>
            <p className="text-2xl font-bold mb-4">
              $9.99<span className="text-sm font-normal">/month</span>
            </p>
            <ul className="space-y-2 flex-grow mb-4">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>100 Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Advanced Settings</span>
              </li>
            </ul>
            <Button className="w-full mt-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              Upgrade to Plus
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-2xl font-bold mb-4">
              $19.99<span className="text-sm font-normal">/month</span>
            </p>
            <ul className="space-y-2 flex-grow mb-4">
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Unlimited Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>24/7 Premium Support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>All Features + Early Access</span>
              </li>
            </ul>
            <Button className="w-full mt-auto" variant="outline">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
