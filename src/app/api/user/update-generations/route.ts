import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

// Define an extended user type to include generationsLeft
interface ExtendedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  planType: "FREE" | "PLUS" | "PRO";
  generationsLeft: number;
}

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find the user
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cast to extended user type
    const user = dbUser as unknown as ExtendedUser;

    // Update user's generation count (ensure it doesn't go below 0)
    const updatedDbUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        // @ts-expect-error - generationsLeft exists in the database schema
        generationsLeft: Math.max(0, user.generationsLeft - 1),
      },
    });

    // Cast to extended user type
    const updatedUser = updatedDbUser as unknown as ExtendedUser;

    return NextResponse.json({
      success: true,
      generationsLeft: updatedUser.generationsLeft,
    });
  } catch (error) {
    console.error("Error updating generations:", error);
    return NextResponse.json(
      { error: "Failed to update generations" },
      { status: 500 }
    );
  }
}
