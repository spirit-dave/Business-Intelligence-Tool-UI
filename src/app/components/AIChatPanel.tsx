import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Send, Bot, User, Sparkles } from "lucide-react";

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

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: question };
    const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages(prev => [...prev, userMessage, assistantMessage]);

    try {
      const res = await fetch("/api/chat_stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, business_data: businessData }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id ? { ...m, content: m.content + chunk } : m
          )
        );
      }
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: "[Error: Unable to generate response]" }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b shrink-0 flex items-center gap-2">
        <Sparkles className="text-primary w-5 h-5" />
        <h2 className="font-medium text-sm sm:text-base">AI Business Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6 space-y-4 scroll-smooth">
        {messages.map(m => (
          <div key={m.id} className={`flex gap-2 items-start ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && <Bot className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />}
            <div className={`rounded-lg px-3 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words max-w-[92%] sm:max-w-[75%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent/40 text-foreground"}`}>
              {m.content}
            </div>
            {m.role === "user" && <User className="w-4 h-4 mt-1 shrink-0 text-muted-foreground" />}
          </div>
        ))}
        <div ref={bottomRef} />
        {loading && <div className="text-xs text-muted-foreground italic px-2">Thinking…</div>}
      </div>

      {/* Input */}
      <div className="p-3 sm:p-6 border-t shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about the business..."
            className="resize-none text-sm leading-relaxed max-h-32"
            rows={2}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleSend} disabled={loading} className="h-10 w-10 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
