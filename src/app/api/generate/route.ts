import { NextRequest, NextResponse } from "next/server";
import { generateLogo } from "@/lib/gemini";
import { getServerSession } from "next-auth";

// Since we don't have direct DB access to update the generation count,
// we'll use localStorage on the client side to track generations.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    // Properly handle unauthenticated users with a clear error
    if (!session?.user?.email) {
      console.log("No authenticated session found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse the request body (handle potential parsing errors)
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { sketch, generationsLeft } = body;

    if (!sketch) {
      return NextResponse.json(
        { error: "No sketch provided" },
        { status: 400 }
      );
    }

    // Check if the user has any generations left
    if (generationsLeft <= 0) {
      return NextResponse.json(
        {
          error: "Generation limit reached",
          planLimitReached: true,
        },
        { status: 403 }
      );
    }

    // Generate the logo
    const aiGeneratedLogo = await generateLogo(sketch);

    // Return a properly formatted JSON response with CORS headers
    return new NextResponse(
      JSON.stringify({
        logo: aiGeneratedLogo,
        generationsLeft: generationsLeft - 1,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache",
        },
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
