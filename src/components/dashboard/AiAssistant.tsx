import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Як магнітна буря сьогодні впливає на мене?",
  "Які поради на сьогодні?",
  "Що означає поточний Kp-індекс?",
];

export const AiAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    scrollToBottom();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("ai-assistant", {
        body: {
          message: text.trim(),
          history: messages,
        },
      });

      if (res.error) throw res.error;

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.data.reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Вибачте, сталася помилка. Спробуйте ще раз." },
      ]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const isGuest = !user;

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label="Відкрити ШІ-асистент"
        >
          <Sparkles className="h-5 w-5" />
          <span className="hidden sm:inline text-sm font-medium">ШІ-асистент</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed z-50 flex flex-col border border-border bg-background shadow-2xl overflow-hidden bottom-0 right-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[360px] sm:max-w-[calc(100vw-2rem)] sm:h-[520px] sm:max-h-[calc(100vh-6rem)] sm:rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">ШІ-асистент</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono">beta</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-secondary transition-colors"
              aria-label="Закрити"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                {isGuest ? (
                  <>
                    <div>
                      <p className="text-sm font-medium text-foreground">Вітаю! 👋</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Я ШІ-асистент з космічної погоди. Щоб отримати персоналізовані поради щодо впливу магнітних бур на ваше здоров'я, увійдіть або зареєструйтесь.
                      </p>
                    </div>
                    <a
                      href="/auth"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      Увійти / Зареєструватись
                    </a>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-foreground">Вітаю! 👋</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Я ваш персональний ШІ-асистент з космічної погоди. Запитуйте про магнітні бурі та їх вплив на ваше здоров'я.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-card hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border rounded-bl-sm"
                  }`}
                >
                  {msg.content.split("\n").map((line, li) => (
                    <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-xl rounded-bl-sm px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          {isGuest ? (
            <div className="px-3 py-3 border-t border-border bg-card text-center">
              <a href="/auth" className="text-xs text-primary hover:underline font-medium">
                Увійдіть, щоб почати розмову →
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Запитайте про магнітні бурі..."
                  className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                  aria-label="Надіслати"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};
