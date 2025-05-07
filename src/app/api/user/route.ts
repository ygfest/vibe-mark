import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// Define extended user type including new fields
interface ExtendedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  planType: "FREE" | "PLUS" | "PRO";
  generationsLeft: number;
}

// Since we haven't updated the schema yet, we'll simulate the plan type and generations left
export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle potential missing fields with defaults
    // This ensures backward compatibility during database migration
    const extendedUser: ExtendedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      planType:
        (user as unknown as { planType?: "FREE" | "PLUS" | "PRO" }).planType ||
        "FREE",
      generationsLeft:
        (user as unknown as { generationsLeft?: number }).generationsLeft ?? 10,
    };

    return NextResponse.json({ user: extendedUser });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}
