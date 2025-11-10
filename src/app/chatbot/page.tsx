"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const DEFAULT_PROMPT =
  "Bạn là trợ lý số của bảo tàng 1975–1986. Trả lời súc tích, có trích dẫn nguồn nếu biết.";

export default function ChatbotPage() {
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    const storedPrompt = localStorage.getItem("gemini-system-prompt");
    if (storedKey) setApiKey(storedKey);
    if (storedPrompt) setSystemPrompt(storedPrompt);
  }, []);

  useEffect(() => {
    localStorage.setItem("gemini-system-prompt", systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const handleSubmit = async () => {
    if (!canSend) return;
    setLoading(true);
    setError(null);

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
    };

    const history = [...messages, newMessage];
    setMessages(history);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey || undefined,
          systemPrompt,
          history: history.map(({ role, text }) => ({ role, text })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Gemini trả về lỗi.");
      }

      const data = await response.json();
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "model",
        text: data.text || "(Không có phản hồi)",
      };
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gửi được yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <header className="mb-10 space-y-3">
        <span className="hero-label">Trợ lý Gemini</span>
        <h1 className="hero-title">Chatbot 1975–1986</h1>
        <p className="hero-description max-w-2xl">
          Chatbot sử dụng Gemini để hỗ trợ trả lời câu hỏi về giai đoạn 1975–1986. Cần cấu hình API key trong môi trường
          backend hoặc trình duyệt (localStorage).
        </p>
      </header>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-lg shadow-black/30">
        <div ref={scrollRef} className="mb-4 max-h-[420px] overflow-y-auto pr-2">
          {messages.length === 0 && (
            <p className="text-sm text-gray-400">
              Bắt đầu cuộc trò chuyện để trợ lý gợi ý dữ kiện, nguồn tư liệu hoặc giải thích chính sách bao cấp.
            </p>
          )}
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-lg shadow-black/40 ${
                  message.role === "user"
                    ? "bg-[#b5964d] text-black"
                    : "bg-black/60 text-gray-100 border border-white/5"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-black/60 px-4 py-3 text-sm text-gray-200">Gemini đang trả lời...</div>
            </div>
          )}
        </div>
        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Đặt câu hỏi..."
            className="min-h-[96px] flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#b5964d] focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className="rounded-2xl bg-[#b5964d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d5b86f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Gửi
          </button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          API key và system prompt được đọc từ localStorage với khóa <code>gemini-api-key</code> và
          <code>gemini-system-prompt</code>. Bạn có thể chỉnh trong <code>src/app/chatbot/page.tsx</code>.
        </p>
      </section>
    </div>
  );
}

