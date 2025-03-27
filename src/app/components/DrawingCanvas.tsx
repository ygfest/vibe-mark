"use client";

import { Tldraw } from "@tldraw/tldraw";
import { useCallback, useRef } from "react";
import { blobToBase64 } from "@/lib/utils";
import toast from "react-hot-toast";

interface DrawingCanvasProps {
  onGenerate: (sketch: string) => void;
}

export default function DrawingCanvas({ onGenerate }: DrawingCanvasProps) {
  const editorRef = useRef<any>(null);

  const handleGenerate = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      // Get all shapes
      const shapes = editorRef.current.getCurrentPageShapes();
      if (shapes.length === 0) {
        toast.error("Please draw something first");
        throw new Error("Please draw something first.");
      }

      // Export as PNG blob
      const blob = await editorRef.current.exportImage({
        format: "png",
        quality: 1,
        scale: 2,
        background: true,
      });

      if (!blob) {
        toast.error("Please Give me an OPENAI API KEY. I'm broke");
        throw new Error("Could not generate image.");
      }

      const base64Data = await blobToBase64(blob);
      onGenerate(base64Data);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  }, [onGenerate]);

  return (
    <div className="space-y-4">
      <div className="w-full h-[600px] border rounded-lg overflow-hidden">
        <Tldraw
          onMount={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
      <button
        onClick={handleGenerate}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
      >
        Generate Logo
      </button>
    </div>
  );
}
