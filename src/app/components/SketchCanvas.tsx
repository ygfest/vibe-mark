"use client";
import { useRef } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function SketchCanvas({
  onGenerate,
}: {
  onGenerate: (sketch: string) => void;
}) {
  const canvasRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (!canvasRef.current) return;
    const sketchData = await canvasRef.current.exportImage("png");
    onGenerate(sketchData);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ReactSketchCanvas
        ref={canvasRef}
        width="400px"
        height="400px"
        strokeWidth={4}
        strokeColor="black"
      />
      <button
        onClick={handleGenerate}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Generate Logo
      </button>
    </div>
  );
}
