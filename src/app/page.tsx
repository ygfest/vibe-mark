"use client";
import { useState } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sliders } from "lucide-react";

export default function Home() {
  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (sketch: string) => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ sketch }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate logo");
      }

      const data = await res.json();
      setLogo(data.logo);
      toast.success("Logo generated successfully!");
    } catch (error) {
      console.error("Error generating logo:", error);
      toast.error("Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground text-center">
          Logo Generator
        </h1>

        <Tabs defaultValue="draw" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-background border border-border">
            <TabsTrigger
              value="draw"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Draw
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Sliders className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <DrawingCanvas onGenerate={handleGenerate} />
            {logo && (
              <div className="mt-4 p-6 bg-card rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                  Generated Logo
                </h2>
                <img
                  src={logo}
                  alt="AI-generated logo"
                  className="w-full max-w-md mx-auto border border-border rounded-lg shadow-lg"
                />
                <a
                  href={logo}
                  download="logo.png"
                  className="block w-full max-w-md mx-auto mt-6 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-center transition-colors"
                >
                  Download Logo
                </a>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="settings"
            className="p-6 bg-card rounded-lg border border-border"
          >
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Color Settings
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Primary Color
                </label>
                <input
                  type="color"
                  className="w-full h-12 rounded-lg cursor-pointer bg-background border border-border p-1"
                  defaultValue="#000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Background Color
                </label>
                <input
                  type="color"
                  className="w-full h-12 rounded-lg cursor-pointer bg-background border border-border p-1"
                  defaultValue="#ffffff"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
