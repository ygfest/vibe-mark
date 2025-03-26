import { NextRequest, NextResponse } from "next/server";
import { generateLogo } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { sketch } = await req.json();
  if (!sketch)
    return NextResponse.json({ error: "No sketch provided" }, { status: 400 });

  try {
    const aiGeneratedLogo = await generateLogo(sketch);
    return NextResponse.json({ logo: aiGeneratedLogo });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
