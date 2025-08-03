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
 * Expected JSON body: { content: string, title?: string, systemPrompt?: string }
 * Returns: { suggestion: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { content, title, systemPrompt } = await req.json();

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

    // Enhanced system prompt for journal writing
    const defaultSystemPrompt = `You are an empathetic AI writing assistant for a personal journaling app called Clearview. Your role is to help users continue their journal entries naturally and thoughtfully with questions and suggestions.

GUIDELINES:
- Provide prompts for the user to naturally continue writing
- Be aware of their tone and emotional state
- Be supportive and encouraging, especially for vulnerable content
- Focus on self-reflection, personal growth, and mindfulness
- Ask questions that help the user explore their thoughts deeper
- Keep suggestions less than 15 words
- Help users explore their thoughts deeper or move their narrative forward
- Be inclined to ask questions
- Ask questions connected to what the user has already journaled
- Avoid being prescriptive or giving direct advice

CONTEXT: This is a personal journal entry where the user has paused while writing.

${title ? `Entry Title: "${title}"` : ''}

Current Content: "${content}"

Generate a natural, encouraging suggestion or question that helps the user explore their thoughts further:`;

    const prompt = systemPrompt
      ? `${systemPrompt}\n\nUser: ${content}`
      : defaultSystemPrompt;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Handle different response formats from the API
    let suggestion: string = "";
    
    if (response && typeof response === 'object') {
      suggestion = (response as any).text || 
                  (response as any).response || 
                  (response as any).candidates?.[0]?.content?.parts?.[0]?.text || 
                  "";
    }

    // Clean up the suggestion (remove quotes if AI added them)
    const cleanSuggestion = suggestion.replace(/^["']|["']$/g, '').trim();

    return NextResponse.json({ suggestion: cleanSuggestion });
  } catch (err) {
    console.error("AI suggestion error", err);
    return NextResponse.json({ 
      suggestion: "",
      error: "Failed to generate suggestion" 
    });
  }
}
