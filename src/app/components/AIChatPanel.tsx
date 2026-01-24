import { useState } from "react";
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
    <div className="bg-white rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-medium text-sm sm:text-base">
          AI Business Assistant
        </h2>
      </div>

      {/* Messages (NO SCROLL CONTAINER) */}
      <div className="px-4 py-4 space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <Bot className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
            )}

            <div
              className={`
                rounded-lg
                px-4 py-3
                text-sm
                leading-relaxed
                whitespace-pre-wrap
                break-words
                max-w-[95%]
                sm:max-w-[75%]
                ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent/40 text-foreground"
                }
              `}
            >
              {m.content}
            </div>

            {m.role === "user" && (
              <User className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />
            )}
          </div>
        ))}

        {loading && (
          <p className="text-xs text-muted-foreground italic">
            Thinking…
          </p>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 sticky bottom-0 bg-white">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about the business..."
            className="resize-none text-sm"
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
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
