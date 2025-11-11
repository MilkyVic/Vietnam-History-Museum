"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

const DEFAULT_PROMPT = `
Ban la Thay giao Lich su Viet Nam, chuyen sau giai doan 1975-1986. Hay giai thich de hieu, chinh xac va co dan chung ro rang.
- Chi tra loi noi dung thuoc lich su Viet Nam 1975-1986 (co the nhac toi boi canh gan ke neu that su can). Neu cau hoi vuot pham vi thi tu choi lich su.
- Moi luan diem chinh phai di kem nguon dang tin (sach/giao trinh, bai nghien cuu, van kien). Dinh dang goi y: [Tac gia, Nam, trang] hoac [Nguon, lien ket]. Neu chua du nguon hay thong bao "Chua du nguon de ket luan".
- Cau truc: (1) Tom tat ngan 2-3 cau. (2) Phan tich chi tiet: Boi canh - Dien bien - He qua - Tranh luan su hoc - Tai lieu tham khao. Co the bo sung flashcard/cau hoi on tap khi hop ly.
- Phan biet du kien va dien giai, neu ro cac goc nhin su hoc neu ton tai tranh luan.
- Ngon ngu su pham, trung lap, neu ro moc thoi gian cu the.
- Tra loi bang van ban thuong (plain text), khong dung Markdown hay ky hieu dam/nghieng (khong **bold**, *italic*, dau sao, dau gach). Neu can nhan manh thi dung cau noi truc tiep.
- Neu cau hoi nam ngoai pham vi 1975-1986, hay tu choi va moi nguoi dung dat cau hoi phu hop.
`;

export default function ChatbotPage() {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatVersion, setChatVersion] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedPrompt = localStorage.getItem("gemini-system-prompt");
    const storedSessions = localStorage.getItem("chatbot-sessions");
    if (storedPrompt) setSystemPrompt(storedPrompt);

    if (storedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(storedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch {
        console.warn("Khong doc duoc lich su chat, se tao moi.");
      }
    }

    const defaultSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "Cuoc tro chuyen moi",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions([defaultSession]);
    setActiveSessionId(defaultSession.id);
  }, []);

  useEffect(() => {
    localStorage.setItem("gemini-system-prompt", systemPrompt);
  }, [systemPrompt]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("chatbot-sessions", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sessions, activeSessionId, loading]);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || null,
    [sessions, activeSessionId]
  );
  const messages = activeSession?.messages ?? [];

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const sessionTitleFrom = (text: string) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length === 0) return "Cuoc tro chuyen moi";
    return clean.length > 42 ? `${clean.slice(0, 39)}...` : clean;
  };

  const formatMessageText = (text: string) => text.replace(/\*\*/g, "");

  const updateSessionMessages = (sessionId: string, updater: (prev: Message[]) => Message[]) => {
    setSessions((prev) => {
      const updated = prev.map((session) => {
        if (session.id !== sessionId) return session;
        const nextMessages = updater(session.messages);
        const shouldRename = session.messages.length === 0;
        const nextTitle =
          shouldRename && nextMessages.length > 0
            ? sessionTitleFrom(nextMessages.find((msg) => msg.role === "user")?.text || session.title)
            : session.title;
        return {
          ...session,
          title: nextTitle,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      });
      return [...updated].sort((a, b) => b.updatedAt - a.updatedAt);
    });
  };

  const handleSubmit = async () => {
    if (!canSend || !activeSessionId) return;
    setLoading(true);
    setError(null);

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
    };

    updateSessionMessages(activeSessionId, (prev) => [...prev, newMessage]);
    setInput("");

    const historyPayload = [...messages, newMessage];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          history: historyPayload.map(({ role, text }) => ({ role, text })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Gemini tra ve loi.");
      }

      const data = await response.json();
      const reply: Message = {
        id: crypto.randomUUID(),
        role: "model",
        text: data.text || "(Khong co phan hoi)",
      };
      updateSessionMessages(activeSessionId, (prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Khong gui duoc yeu cau.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: `Cuoc tro chuyen moi #${chatVersion + 1}`,
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput("");
    setError(null);
    setChatVersion((version) => version + 1);
  };

  return (
    <div className="section">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="hero-label">Tro ly Bao Tang So</span>
          <h1 className="hero-title">Chatbot 1975-1986</h1>
        </div>
        <button
          onClick={handleNewChat}
          className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-xs font-semibold tracking-[0.2em] text-white transition hover:border-[#b5964d] hover:text-[#b5964d]"
        >
          CHAT MOI #{chatVersion}
        </button>
      </div>

      <section className="flex min-h-[520px] gap-6 rounded-3xl border border-white/10 bg-black/30 p-4 shadow-xl shadow-black/40">
        <aside className="hidden w-64 flex-shrink-0 flex-col rounded-3xl border border-white/10 bg-black/50 p-4 text-sm text-white lg:flex">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-gray-400">
            <span>Cuoc tro chuyen</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1">
            {sessions.length === 0 && (
              <p className="text-xs text-gray-500">Chua co lich su. Bat dau mot cuoc tro chuyen moi.</p>
            )}
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id}>
                  <button
                    onClick={() => setActiveSessionId(session.id)}
                    className={`w-full rounded-2xl px-3 py-3 text-left transition ${
                      session.id === activeSessionId
                        ? "bg-white/10 text-white shadow-inner shadow-black/40"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-white/60">Chat</p>
                    <p className="truncate text-sm font-semibold">{session.title}</p>
                    <span className="text-[10px] text-gray-500">
                      {new Date(session.updatedAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 rounded-3xl border border-white/10 bg-black/40 p-6">
          <div
            ref={scrollRef}
            className="mb-4 max-h-[420px] overflow-y-auto rounded-2xl border border-white/5 bg-black/40 p-4 pr-2 shadow-inner shadow-black/60"
          >
            {messages.length === 0 && (
              <p className="text-sm text-gray-400">
                Bat dau cuoc tro chuyen de tro ly goi y du kien, nguon tu lieu hoac giai thich chinh sach bao cap.
              </p>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xl rounded-2xl border border-[#b5964d]/50 bg-[#b5964d]/10 px-4 py-3 text-sm text-white shadow-lg shadow-black/40 ${
                    message.role === "user" ? "bg-[#b5964d] text-black" : ""
                  }`}
                >
                  <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
                    {message.role === "user" ? "Ban" : "Tro ly"}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed">{formatMessageText(message.text)}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/5 bg-black/60 px-4 py-3 text-sm text-gray-200">
                  Dang tao cau tra loi...
                </div>
              </div>
            )}
          </div>
          {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Dat cau hoi..."
              className="min-h-[96px] flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#b5964d] focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className="rounded-2xl bg-[#b5964d] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#d5b86f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Gui
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
