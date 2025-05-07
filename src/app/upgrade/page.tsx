"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers/user-provider";

export default function UpgradePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Show loading state while user data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-zinc-700 dark:text-zinc-300">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header with navigation */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Header with gradient */}
      <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-32 px-6 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Unlock unlimited logo generation and premium features with our pro
            plans
          </p>
        </div>
      </div>

      {/* Plans section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-6">$0</p>
            <ul className="space-y-4 flex-grow mb-8">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>10 Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>Basic Support</span>
              </li>
            </ul>
            <Button
              className="w-full mt-auto py-6 text-lg"
              variant="outline"
              disabled={user.planType === "FREE"}
            >
              {user.planType === "FREE" ? "Current Plan" : "Downgrade to Free"}
            </Button>
          </div>

          {/* Plus Plan */}
          <div className="border-2 border-purple-500 rounded-xl p-8 flex flex-col h-full shadow-xl relative transform transition-transform duration-300 hover:scale-[1.02] bg-white dark:bg-zinc-900 z-10">
            <div className="absolute -top-4 -right-4 bg-purple-500 text-white text-sm py-1 px-4 rounded-full font-medium">
              Popular
            </div>
            <h3 className="text-2xl font-semibold mb-2">Plus</h3>
            <p className="text-3xl font-bold mb-2">
              $9.99<span className="text-base font-normal">/month</span>
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Perfect for regular creators
            </p>
            <ul className="space-y-4 flex-grow mb-8">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>100 Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>Priority Support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>Advanced Settings</span>
              </li>
            </ul>
            <Button
              className="w-full mt-auto py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              disabled={user.planType === "PLUS"}
            >
              {user.planType === "PLUS" ? "Current Plan" : "Upgrade to Plus"}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-2">
              $19.99<span className="text-base font-normal">/month</span>
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              For power users
            </p>
            <ul className="space-y-4 flex-grow mb-8">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>Unlimited Generations</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>24/7 Premium Support</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500 flex-shrink-0" />
                <span>All Features + Early Access</span>
              </li>
            </ul>
            <Button
              className="w-full mt-auto py-6 text-lg"
              variant="outline"
              disabled={user.planType === "PRO"}
            >
              {user.planType === "PRO" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </div>
        </div>

        {/* Features comparison section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-16">All Plans Include</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-600 dark:text-purple-400"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">High Quality Logos</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Export in multiple formats including SVG and PNG with
                transparent backgrounds
              </p>
            </div>
            <div className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-600 dark:text-blue-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 14.14 14.14" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Watermarks</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                All logos are generated without any watermarks or branding
              </p>
            </div>
            <div className="p-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Commercial Use</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Use generated logos for any commercial project
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
