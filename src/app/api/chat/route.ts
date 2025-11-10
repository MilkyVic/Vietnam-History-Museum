import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type RequestPayload = {
  systemPrompt?: string;
  history: ChatMessage[];
};

const MODEL_NAME = "google/gemma-3-27b-it:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REFERER = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "http://localhost:3000";
const APP_TITLE = "Bao cap chatbot";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OpenRouter API key (OPENROUTER_API_KEY)." },
        { status: 400 }
      );
    }

    const history = body.history || [];
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [];

    if (body.systemPrompt) {
      messages.push({ role: "system", content: body.systemPrompt });
    }

    history.forEach((entry) => {
      messages.push({
        role: entry.role === "model" ? "assistant" : "user",
        content: entry.text,
      });
    });

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": REFERER,
        "X-Title": APP_TITLE,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error", response.status, errorText);
      return NextResponse.json({ error: "Unable to reach OpenRouter." }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat route error", error);
    return NextResponse.json({ error: "Unable to process the request." }, { status: 500 });
  }
}
