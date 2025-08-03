import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY!;
const MODEL_ID = "gemini-1.5-flash";

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      userSummary,
      recentActivity,
      recentMessages,
      currentMessage,
    } = await request.json();

    if (!currentMessage) {
      return NextResponse.json(
        { error: "No current message provided" },
        { status: 400 }
      );
    }

    // Build the wellness coach prompt
    const prompt = `You are a wellness coach. This is what you know:
Name: ${name || "User"}.
${userSummary || "No user summary available."}.
${recentActivity || "No recent activity summary available."}.
${recentMessages || "No recent chat history available."}.
Current message: ${currentMessage}

Generate a response that is both supportive and helpful for the user.`;

    console.log("Sending prompt to Gemini:", prompt);

    // Prepare the request body for Gemini
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "text/plain",
      },
    };

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate response", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Gemini response received");

    // Extract the text response
    let responseText = "";

    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            responseText = part.text;
            break;
          }
        }
      }
    }

    if (!responseText) {
      return NextResponse.json(
        { error: "No response was generated" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error) {
    console.error("Error in wellness coach API:", error);
    return NextResponse.json(
      { error: "Failed to process wellness coach request" },
      { status: 500 }
    );
  }
}
