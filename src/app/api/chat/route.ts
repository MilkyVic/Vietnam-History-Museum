import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type RequestPayload = {
  apiKey?: string;
  systemPrompt?: string;
  history: ChatMessage[];
};

const MODEL_NAME = "google/gemma-3-27b-it:free";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const HARDCODED_API_KEY = "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"; // N?u c?n thi?t c� th? t?m g?n key OpenRouter t?i d�y (kh�ng khuy?n kh�ch).
const REFERER = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";
const APP_TITLE = "Bao cap chatbot";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;
    const apiKey = body.apiKey || process.env.OPENROUTER_API_KEY || HARDCODED_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Thi?u API key c?a OpenRouter (OPENROUTER_API_KEY)." },
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
      return NextResponse.json({ error: "Kh�ng th? k?t n?i OpenRouter." }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat route error", error);
    return NextResponse.json({ error: "Kh�ng th? x? l� y�u c?u." }, { status: 500 });
  }
}