"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  // Only mount the component after the first render on the client
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent scrolling when modal is open and hide TLDraw UI
  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling
      document.body.style.overflow = "hidden";

      // Hide TLDraw components by creating a style that overrides all their z-indices
      const styleTag = document.createElement("style");
      styleTag.id = "modal-override";
      styleTag.innerHTML = `
        /* Completely hide TLDraw UI elements when modal is open */
        .tlui-layout,
        .tlui-menu,
        .tlui-toolbar,
        .tlui-tools,
        .tlui-debug-panel,
        .tlui-help-menu,
        .tlui-shortcuts-dialog,
        .tlui-dialogs,
        .tlui-style-panel,
        [data-testid="canvas"],
        [data-testid="canvas-container"],
        [data-testid="draw-tool-options"],
        .tlui-style-panel__section {
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          user-select: none !important;
        }
        
        /* Override Radix UI portals too */
        [data-radix-popper-content-wrapper] {
          display: none !important;
        }
        
        /* Ensure our overlay is above everything */
        #plan-upgrade-modal-overlay {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483647 !important;
          visibility: visible !important;
          opacity: 1 !important;
          display: flex !important;
          background: rgba(0,0,0,0.8) !important;
          backdrop-filter: blur(8px) !important;
        }
      `;
      document.head.appendChild(styleTag);

      // Additionally, try to directly move or hide TLDraw's elements that might be in portals
      const tlDrawComponents = document.querySelectorAll(
        ".tlui-popover, .tlui-dialog, .tlui-menu"
      );
      tlDrawComponents.forEach((el) => {
        const element = el as HTMLElement;
        if (element) {
          element.style.display = "none";
          element.style.visibility = "hidden";
          element.style.opacity = "0";
          element.style.pointerEvents = "none";
        }
      });
    } else {
      // Restore scrolling
      document.body.style.overflow = "unset";

      // Remove style tag when modal is closed
      const styleTag = document.getElementById("modal-override");
      if (styleTag) styleTag.remove();
    }

    return () => {
      document.body.style.overflow = "unset";
      const styleTag = document.getElementById("modal-override");
      if (styleTag) styleTag.remove();
    };
  }, [isOpen]);

  // Don't render anything if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Create portal to attach modal directly to document body
  return createPortal(
    <div
      id="plan-upgrade-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
      style={{ isolation: "isolate" }}
    >
      <div className="relative w-full h-full overflow-auto bg-white dark:bg-zinc-900 md:w-auto md:h-auto md:max-w-6xl md:max-h-[90vh] md:rounded-xl my-0 md:my-8 mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-[2147483647] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Full-width header with gradient */}
        <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-32 px-6 flex flex-col items-center justify-center">
          <div className="max-w-4xl mx-auto w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isOutOfGenerations
                ? "You've used all your generations!"
                : "Upgrade Your Plan"}
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {isOutOfGenerations
                ? "Upgrade now to continue creating amazing logos"
                : "Unlock unlimited logo generation and premium features with our pro plans"}
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
                disabled
              >
                Current Plan
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
              <Button className="w-full mt-auto py-6 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                Upgrade to Plus
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
              <Button className="w-full mt-auto py-6 text-lg" variant="outline">
                Upgrade to Pro
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
                <h3 className="text-xl font-semibold mb-2">
                  High Quality Logos
                </h3>
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
    </div>,
    document.body
  );
}
