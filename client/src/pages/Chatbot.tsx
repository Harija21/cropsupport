import { useState, useRef, useEffect } from "react";
import { useAiChat, useAiHistory } from "@/hooks/use-ai";
import { format } from "date-fns";
import { Send, Sprout, User, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const { data: history, isLoading } = useAiHistory();
  const chatMutation = useAiChat();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, chatMutation.isPending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    
    const question = input;
    setInput("");
    await chatMutation.mutateAsync(question);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-3xl overflow-hidden border border-border/50 shadow-xl">
      <div className="bg-white/80 backdrop-blur-md p-6 border-b border-border/50 flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">AI Agronomist</h1>
          <p className="text-sm text-muted-foreground">Ask anything about farming, crops, or techniques</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background/50 to-background/90">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : history?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <MessageSquare className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Start a conversation</h3>
            <p className="text-muted-foreground text-sm">Ask about optimal planting times, fertilizer recommendations, or pest control methods.</p>
          </div>
        ) : (
          history?.map((chat) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={chat.id} className="space-y-6">
              {/* User Message */}
              <div className="flex gap-4 justify-end">
                <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                  <p className="leading-relaxed">{chat.question}</p>
                  <p className="text-xs mt-2 text-primary-foreground/70 text-right">
                    {format(new Date(chat.createdAt!), 'h:mm a')}
                  </p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white border border-border/50 p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  <p className="leading-relaxed text-foreground whitespace-pre-wrap">{chat.answer}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}

        {chatMutation.isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-white border border-border/50 p-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your farming question..."
            className="flex-1 px-6 py-4 bg-muted/50 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
            disabled={chatMutation.isPending}
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className="px-6 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
          >
            {chatMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  );
}

