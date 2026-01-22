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

export function AIChatPanel({
  businessData,
}: {
  businessData: any;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input;
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
          content: res.message,
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
    <div className="flex flex-col h-full min-h-[300px] bg-white rounded-lg border border-border">
      <div className="p-6 border-b">
        <div className="flex gap-2 items-center">
          <Sparkles className="text-primary" />
          <h2>AI Business Assistant</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex gap-2 ${
              m.role === "user" ? "justify-end" : ""
            }`}
          >
            {m.role === "assistant" && <Bot />}
            <div className="bg-accent/40 rounded-lg p-3 max-w-[75%]">
              {m.content}
            </div>
            {m.role === "user" && <User />}
          </div>
        ))}

        {loading && <div>Thinking…</div>}
        <div ref={bottomRef} />
      </div>

      <div className="p-6 border-t flex gap-2">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the business..."
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <Button className="self-end h-10 w-10 sm:h-auto sm:w-auto">
          <Send />
        </Button>
      </div>
    </div>
  );
}
