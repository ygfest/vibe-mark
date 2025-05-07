import { NextRequest, NextResponse } from "next/server";
import { generateLogo } from "@/lib/gemini";
import { getServerSession } from "next-auth";

// Since we don't have direct DB access to update the generation count,
// we'll use localStorage on the client side to track generations.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { sketch, prompt, generationsLeft } = await req.json();

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

    return NextResponse.json({
      logo: aiGeneratedLogo,
      generationsLeft: generationsLeft - 1,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
