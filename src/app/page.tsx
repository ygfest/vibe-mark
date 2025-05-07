"use client";
import { useState, useEffect } from "react";
import DrawingCanvas from "./components/DrawingCanvas";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sliders } from "lucide-react";
import LogOutButton from "@/components/log-out-button";
import ExportMenu from "@/components/export-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import UpgradePlanButton from "@/components/upgrade-plan-button";
import { useUser } from "@/components/providers/user-provider";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const [logo, setLogo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, refreshUserData, setIsPlanLimitReached } = useUser();
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const handleGenerate = async (sketch: string) => {
    try {
      if (sessionStatus !== "authenticated") {
        toast.error("Please sign in to generate logos");
        router.push("/sign-in");
        return;
      }

      setIsGenerating(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ sketch }),
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      });

      console.log("Generate response status:", res.status);

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: `Server error: ${res.status}` };
        }

        if (errorData.planLimitReached) {
          setIsPlanLimitReached(true);
          router.push("/upgrade");
          toast.error(
            "You've reached your generation limit. Please upgrade your plan."
          );
          return;
        }

        if (res.status === 401) {
          toast.error("Please sign in to generate logos");
          router.push("/sign-in");
          return;
        }

        toast.error(errorData.error || "Failed to generate logo");
        throw new Error(errorData.error || "Failed to generate logo");
      }

      const data = await res.json();
      setLogo(data.logo);

      // Refresh user data from the server to get the updated generations count
      await refreshUserData();

      toast.success("Logo generated successfully!");
    } catch (error) {
      console.error("Error generating logo:", error);
      toast.error("Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      toast.error("Please sign in to use the logo generator");
      router.push("/sign-in");
    }
  }, [sessionStatus, router]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <nav className="w-full sticky top-0 z-50 md:static md:z-auto">
        <div className="w-full h-16 md:h-auto backdrop-blur-sm bg-background/80 md:backdrop-blur-none md:bg-transparent p-4 md:p-8 flex justify-end items-center gap-4">
          <div className="flex items-center gap-4">
            <UpgradePlanButton planType={user.planType} />
            <LogOutButton />
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className="w-full max-w-4xl px-8 pb-8">
        <h1 className="text-2xl font-bold mb-8 text-foreground text-center">
          Rough Sketch to Pro logos in Seconds
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

          <TabsContent value="draw" className="space-y-6">
            <DrawingCanvas
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />

            {logo && (
              <div className="space-y-5">
                <div className="bg-background rounded-xl p-8 flex justify-center items-center">
                  <img
                    src={logo}
                    alt="AI-generated logo"
                    className="max-w-[300px] max-h-[300px] object-contain"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <div className="w-48">
                    <ExportMenu imageUrl={logo} />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="settings"
            className="p-6 bg-card rounded-lg border border-border"
          >
            <h2 className="text-xl font-semibold mb-6 text-card-foreground">
              Settings
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-card-foreground">
                  Color Settings
                </h3>
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
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
