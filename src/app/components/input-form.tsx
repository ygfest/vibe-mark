"use client";
import { useState } from "react";

export default function InputForm({
  setGeneratedImage,
}: {
  setGeneratedImage: (url: string) => void;
}) {
  const [input, setInput] = useState("");

  const generateLogo = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ textPrompt: input }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.image) setGeneratedImage(data.image);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Describe your logo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        onClick={generateLogo}
      >
        Generate Logo
      </button>
    </div>
  );
}
