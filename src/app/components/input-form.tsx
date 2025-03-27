"use client";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-hot-toast";
export default function InputForm({
  setGeneratedImage,
}: {
  setGeneratedImage: (url: string) => void;
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateLogo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ textPrompt: input }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.image) setGeneratedImage(data.image);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Error generating logo");
    } finally {
      setIsLoading(false);
    }
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
        disabled={isLoading}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Generate Logo"
        )}
      </button>
    </div>
  );
}
