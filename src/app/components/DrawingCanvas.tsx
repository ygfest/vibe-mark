"use client";

import { Tldraw, Editor } from "@tldraw/tldraw";
import { useCallback, useRef, useState } from "react";
import { blobToBase64 } from "@/lib/utils";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import PlanUpgradeModal from "@/components/plan-upgrade-modal";

interface DrawingCanvasProps {
  onGenerate: (sketch: string, generationsLeft: number) => void;
  isGenerating: boolean;
}

export default function DrawingCanvas({
  onGenerate,
  isGenerating,
}: DrawingCanvasProps) {
  const editorRef = useRef<Editor | null>(null);
  const { user, isPlanLimitReached, setIsPlanLimitReached } = useUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!editorRef.current) return;

    // Check for generation limits
    if (user.generationsLeft <= 0) {
      setIsPlanLimitReached(true);
      setShowUpgradeModal(true);
      return;
    }

    try {
      // Get all shapes
      const shapes = editorRef.current.getCurrentPageShapes();
      if (shapes.length === 0) {
        toast.error("Please draw something first");
        throw new Error("Please draw something first.");
      }

      // Get SVG of the current page
      const svg = await editorRef.current.getSvg(shapes, {
        scale: 1,
        background: true,
      });

      if (!svg) {
        toast.error("Could not generate SVG from drawing");
        throw new Error("Could not generate SVG from drawing.");
      }

      // Convert SVG to PNG blob
      const svgString = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const blob = await new Promise<Blob>((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            "image/png",
            0.8
          );
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgString);
      });

      if (!blob) {
        toast.error("Could not generate image from drawing");
        throw new Error("Could not generate image from drawing.");
      }

      const base64Data = await blobToBase64(blob);
      onGenerate(base64Data, user.generationsLeft);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  }, [onGenerate, user.generationsLeft, setIsPlanLimitReached]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] border rounded-lg overflow-hidden">
        <Tldraw
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>

      {/* Generation counter display */}
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="text-sm text-muted-foreground">
          Generations left:{" "}
          <span className="font-bold">{user.generationsLeft}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Plan: <span className="font-semibold">{user.planType}</span>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
        disabled={isGenerating || user.generationsLeft <= 0}
      >
        {isGenerating ? (
          <>
            <LoaderCircle className="animate-spin mr-2" />{" "}
            <span>Generating...</span>
          </>
        ) : user.generationsLeft <= 0 ? (
          <>
            <span>Upgrade to Generate More</span>
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <line x1="4" y1="20" x2="20" y2="4" />
              <line x1="15" y1="4" x2="20" y2="4" />
              <line x1="20" y1="9" x2="20" y2="4" />
              <line x1="4" y1="20" x2="9" y2="20" />
              <line x1="4" y1="20" x2="4" y2="15" />
            </svg>
            <span>Generate Logo</span>
          </>
        )}
      </button>

      {/* Upgrade modal when limit is reached */}
      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        isOutOfGenerations={true}
      />
    </div>
  );
}
