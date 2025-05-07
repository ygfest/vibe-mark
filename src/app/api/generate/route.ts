import { NextRequest, NextResponse } from "next/server";
import { generateLogo } from "@/lib/gemini";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// Define an extended user type to include generationsLeft
interface ExtendedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  planType: "FREE" | "PLUS" | "PRO";
  generationsLeft: number;
}

// Since we don't have direct DB access to update the generation count,
// we'll use localStorage on the client side to track generations.
export async function POST(req: NextRequest) {
  try {
    // Use authOptions with getServerSession
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      console.error("No authenticated session found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cast to extended user type
    const user = dbUser as unknown as ExtendedUser;

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

    const { sketch } = body;

    if (!sketch) {
      return NextResponse.json(
        { error: "No sketch provided" },
        { status: 400 }
      );
    }

    // Check if the user has any generations left
    if (user.generationsLeft <= 0) {
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

    if (!aiGeneratedLogo) {
      return NextResponse.json(
        { error: "Failed to generate logo" },
        { status: 500 }
      );
    }

    // Update the user's generation count in the database
    const updatedDbUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-expect-error - generationsLeft exists in the database schema
        generationsLeft: Math.max(0, user.generationsLeft - 1),
      },
    });

    // Cast to extended user type
    const updatedUser = updatedDbUser as unknown as ExtendedUser;

    // Return a properly formatted JSON response with CORS headers
    return new NextResponse(
      JSON.stringify({
        logo: aiGeneratedLogo,
        generationsLeft: updatedUser.generationsLeft,
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
