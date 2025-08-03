import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure the GOOGLE_API_KEY is present
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    "GOOGLE_API_KEY is not set in environment variables. AI suggestions will not work."
  );
}

/**
 * POST /api/ai-suggestion
 * Expected JSON body: { content: string, systemPrompt?: string }
 * Returns: { suggestion: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { content, systemPrompt } = await req.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Invalid content" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json({ suggestion: "" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = systemPrompt
      ? `${systemPrompt}\n\nUser: ${content}`
      : content;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Some SDK versions return the text in different fields; handle gracefully
    const suggestion: string = (response as any).text || (response as any).response || "";

    return NextResponse.json({ suggestion });
  } catch (err) {
    console.error("AI suggestion error", err);
    return NextResponse.json({ suggestion: "" });
  }
}
