"use client";
import { useState } from "react";
import SketchCanvas from "./components/SketchCanvas";

export default function Home() {
  const [logo, setLogo] = useState<string | null>(null);

  const handleGenerate = async (sketch: string) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ sketch }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLogo(data.logo);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Sketch to Logo AI</h1>
      <SketchCanvas onGenerate={handleGenerate} />
      {logo && (
        <div className="mt-4">
          <img
            src={logo}
            alt="AI-generated logo"
            className="border p-2 shadow-lg"
          />
          <a
            href={logo}
            download="logo.png"
            className="block bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            Download Logo
          </a>
        </div>
      )}
    </div>
  );
}
