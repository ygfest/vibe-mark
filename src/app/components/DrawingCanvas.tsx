"use client";

import { Tldraw } from "@tldraw/tldraw";
import { useCallback, useRef } from "react";
import { blobToBase64 } from "@/lib/utils";

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
        throw new Error("Please draw something first.");
      }

      // Get an SVG of the entire page
      const svg = await editorRef.current.getSvg(shapes, {
        scale: 1,
        background: true,
      });

      if (!svg) {
        throw new Error("Could not generate SVG.");
      }

      // Convert SVG to PNG
      const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const blob = await editorRef.current.getSvgAsImage(svg, IS_SAFARI, {
        type: "png",
        quality: 0.8,
        scale: 1,
      });

      if (!blob) {
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
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
      >
        Generate Logo
      </button>
    </div>
  );
}
