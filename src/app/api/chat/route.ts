import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type RequestPayload = {
  apiKey?: string;
  systemPrompt?: string;
  history: ChatMessage[];
};

const MODEL_NAME = "gemini-2.5-pro";
const HARDCODED_API_KEY = "AIzaSyDl5kCelZWrxnMJS1eMiuvf4tuulqdarZA"; // Nếu muốn gắn key trực tiếp tại đây.

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestPayload;
    const apiKey = body.apiKey || process.env.GEMINI_API_KEY || HARDCODED_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Thiếu API key của Gemini." }, { status: 400 });
    }

    const history = body.history || [];
    const contents = history.map((entry) => ({
      role: entry.role === "model" ? "model" : "user",
      parts: [{ text: entry.text }],
    }));

    if (body.systemPrompt) {
      contents.unshift({
        role: "user",
        parts: [{ text: body.systemPrompt }],
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const result = await model.generateContent({ contents });
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Chat route error", error);
    return NextResponse.json({ error: "Không thể xử lý yêu cầu." }, { status: 500 });
  }
}

