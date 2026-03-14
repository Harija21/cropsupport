import { useState, useRef, useEffect } from "react";
import { useAiChat, useAiHistory } from "@/hooks/use-ai";
import { useUser } from "@/hooks/use-auth";
import { useWeather } from "@/hooks/use-weather";
import { format } from "date-fns";
import { Send, Sprout, User, Loader2, MessageSquare, MapPin, CloudSun, Leaf, CalendarDays } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

// Compute current season from month (used locally to display badge)
function getSeasonLabel(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Autumn";
  return "Winter";
}

// Suggested location-aware questions for quick-start
const SUGGESTED_QUESTIONS = [
  "What crops should I plant right now in my location?",
  "What are the common pests I should watch out for this season?",
  "How much water do my crops need given the current weather?",
  "What fertilizer is best for my region's soil type?",
];

export default function Chatbot() {
  const { data: history, isLoading } = useAiHistory();
  const { data: user } = useUser();
  const { data: weather } = useWeather();
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

  const handleSuggestion = async (question: string) => {
    if (chatMutation.isPending) return;
    setInput("");
    await chatMutation.mutateAsync(question);
  };

  const season = getSeasonLabel();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-3xl overflow-hidden border border-border/50 shadow-xl">

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-5 border-b border-border/50">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">AI Agronomist</h1>
            <p className="text-sm text-muted-foreground">Advice tailored to your location, season &amp; weather</p>
          </div>
        </div>

        {/* Context pills — show what the AI knows about this farmer */}
        <div className="flex flex-wrap gap-2 mt-1">
          {user?.location && (
            <span
              data-testid="badge-location"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <MapPin className="w-3 h-3" />
              {user.location}
            </span>
          )}
          <span
            data-testid="badge-season"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
          >
            <CalendarDays className="w-3 h-3" />
            {season}
          </span>
          {weather && (
            <span
              data-testid="badge-weather"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
            >
              <CloudSun className="w-3 h-3" />
              {weather.condition} · {weather.temp}°C
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Leaf className="w-3 h-3" />
            Context-aware AI
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background/50 to-background/90">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : history?.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Start a location-aware conversation</h3>
              <p className="text-muted-foreground text-sm">
                Your AI advisor already knows your location
                {user?.location ? ` (${user.location})` : ""}, the current season ({season}), and your local weather. Ask anything!
              </p>
            </div>

            {/* Suggested questions */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  data-testid={`btn-suggestion-${i}`}
                  onClick={() => handleSuggestion(q)}
                  disabled={chatMutation.isPending}
                  className="text-left p-4 rounded-2xl border border-border/60 bg-white/60 hover:bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 text-sm text-foreground/80 hover:text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          history?.map((chat) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={chat.id}
              className="space-y-6"
            >
              {/* User Message */}
              <div className="flex gap-4 justify-end">
                <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                  <p className="leading-relaxed">{chat.question}</p>
                  <p className="text-xs mt-2 text-primary-foreground/70 text-right">
                    {format(new Date(chat.createdAt!), "h:mm a")}
                  </p>
                </div>
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-white border border-border/50 p-5 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  <div className="prose prose-sm prose-green max-w-none text-foreground
                    prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-4 prose-headings:mb-2
                    prose-h3:text-base prose-h4:text-sm
                    prose-p:leading-relaxed prose-p:my-2
                    prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5
                    prose-ol:my-2 prose-ol:pl-4
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-hr:border-border prose-hr:my-3
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
                  ">
                    <ReactMarkdown>{chat.answer}</ReactMarkdown>
                  </div>
                  {/* Location context tag on each response */}
                  {user?.location && (
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>Advice for {user.location} · {season}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}

        {/* Pending bubble */}
        <AnimatePresence>
          {chatMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-white border border-border/50 p-5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={endOfMessagesRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-border/50">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
          <input
            data-testid="input-chat"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={user?.location
              ? `Ask about farming in ${user.location}…`
              : "Type your farming question…"}
            className="flex-1 px-6 py-4 bg-muted/50 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
            disabled={chatMutation.isPending}
          />
          <button
            data-testid="btn-send"
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className="px-6 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
          >
            {chatMutation.isPending
              ? <Loader2 className="w-6 h-6 animate-spin" />
              : <Send className="w-6 h-6" />}
          </button>
        </form>
      </div>
    </div>
  );
}
