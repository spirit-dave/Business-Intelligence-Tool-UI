import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { askBizIntel } from "@/app/api/chat";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AIChatPanel({ businessData }: { businessData: any }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: question },
    ]);

    try {
      const res = await askBizIntel(question, businessData);

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: res.message || "No response generated.",
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Unable to generate insight at the moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-medium">AI Business Assistant</h2>
        </div>
      </div>

      {/* SCROLLABLE MESSAGE AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "justify-end" : ""
            }`}
          >
            {m.role === "assistant" && (
              <Bot className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            )}

            <div
              className={`
                max-w-[85%] sm:max-w-[75%]
                rounded-xl px-4 py-3 text-sm leading-relaxed
                whitespace-pre-wrap break-words
                ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }
              `}
            >
              {m.content}
            </div>

            {m.role === "user" && (
              <User className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </div>
        ))}

        {loading && (
          <div className="text-sm italic text-muted-foreground">
            Thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t px-4 py-3 sm:px-6 flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the business..."
          className="resize-none"
          rows={2}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          onClick={handleSend}
          disabled={loading}
          className="h-10 w-10 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
