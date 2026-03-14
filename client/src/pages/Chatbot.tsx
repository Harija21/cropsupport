import { useState, useRef, useEffect, useMemo } from "react";
import { useAiChat, useAiHistory } from "@/hooks/use-ai";
import { useUser, getSessionStartTime } from "@/hooks/use-auth";
import { useWeather } from "@/hooks/use-weather";
import { format, isToday, isYesterday } from "date-fns";
import {
  Send, Sprout, User, Loader2, MessageSquare,
  MapPin, CloudSun, Leaf, CalendarDays,
  History, ChevronDown, ChevronUp, MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Query } from "@shared/schema";

function getSeasonLabel(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "Spring";
  if (month >= 6 && month <= 8) return "Summer";
  if (month >= 9 && month <= 11) return "Autumn";
  return "Winter";
}

const SUGGESTED_QUESTIONS = [
  "What crops should I plant right now in my location?",
  "What are the common pests I should watch out for this season?",
  "How much water do my crops need given the current weather?",
  "What fertilizer is best for my region's soil type?",
];

// Group history items by date for the History tab
function groupByDate(items: Query[]): { label: string; items: Query[] }[] {
  const groups: Record<string, Query[]> = {};
  for (const item of items) {
    const d = new Date(item.createdAt!);
    let label: string;
    if (isToday(d)) label = "Today";
    else if (isYesterday(d)) label = "Yesterday";
    else label = format(d, "MMMM d, yyyy");
    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  }
  return Object.entries(groups).map(([label, items]) => ({ label, items }));
}

// Collapsible Q&A card for the History tab
function HistoryCard({ chat, location, season }: { chat: Query; location?: string; season: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/60 rounded-2xl bg-white/80 overflow-hidden shadow-sm">
      <button
        data-testid={`history-toggle-${chat.id}`}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm leading-snug line-clamp-2">{chat.question}</p>
            <p className="text-xs text-muted-foreground mt-1">{format(new Date(chat.createdAt!), "h:mm a")}</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/40 bg-muted/20">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Sprout className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="prose prose-sm prose-green max-w-none text-foreground
                    prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-3 prose-headings:mb-1
                    prose-p:leading-relaxed prose-p:my-1.5
                    prose-ul:my-1.5 prose-ul:pl-4 prose-li:my-0.5
                    prose-ol:my-1.5 prose-ol:pl-4
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-hr:border-border prose-hr:my-2
                  ">
                    <ReactMarkdown>{chat.answer}</ReactMarkdown>
                  </div>
                  {location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{location} · {season}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type Tab = "chat" | "history";

export default function Chatbot() {
  const { data: allHistory, isLoading } = useAiHistory();
  const { data: user } = useUser();
  const { data: weather } = useWeather();
  const chatMutation = useAiChat();
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const season = getSeasonLabel();

  // Only show queries from the current login session in the Chat tab
  const sessionStart = useMemo(() => getSessionStartTime(), []);
  const currentSessionChats = useMemo(() => {
    if (!allHistory) return [];
    if (!sessionStart) return allHistory; // fallback: show all
    return allHistory.filter(
      (q) => q.createdAt && new Date(q.createdAt) >= new Date(sessionStart)
    );
  }, [allHistory, sessionStart]);

  // History tab: queries from BEFORE the current session, newest-first
  const pastChats = useMemo(() => {
    if (!allHistory) return [];
    if (!sessionStart) return [];
    return allHistory.filter(
      (q) => q.createdAt && new Date(q.createdAt) < new Date(sessionStart)
    );
  }, [allHistory, sessionStart]);

  const historyGroups = useMemo(() => groupByDate(pastChats), [pastChats]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") scrollToBottom();
  }, [currentSessionChats, chatMutation.isPending, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    const question = input;
    setInput("");
    await chatMutation.mutateAsync(question);
  };

  const handleSuggestion = async (question: string) => {
    if (chatMutation.isPending) return;
    await chatMutation.mutateAsync(question);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-3xl overflow-hidden border border-border/50 shadow-xl">

      {/* ── Header ── */}
      <div className="bg-white/80 backdrop-blur-md p-5 border-b border-border/50">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">AI Agronomist</h1>
              <p className="text-xs text-muted-foreground">Tailored to your location, season &amp; weather</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center bg-muted/60 rounded-xl p-1 gap-1 shrink-0">
            <button
              data-testid="tab-chat"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "chat"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              data-testid="tab-history"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "history"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-4 h-4" />
              History
              {pastChats.length > 0 && (
                <span className="ml-0.5 bg-primary/15 text-primary text-xs px-1.5 py-0.5 rounded-full font-semibold">
                  {pastChats.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Context badges */}
        <div className="flex flex-wrap gap-2">
          {user?.location && (
            <span data-testid="badge-location" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <MapPin className="w-3 h-3" />{user.location}
            </span>
          )}
          <span data-testid="badge-season" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <CalendarDays className="w-3 h-3" />{season}
          </span>
          {weather && (
            <span data-testid="badge-weather" className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              <CloudSun className="w-3 h-3" />{weather.condition} · {weather.temp}°C
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Leaf className="w-3 h-3" />Context-aware AI
          </span>
        </div>
      </div>

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background/50 to-background/90">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : currentSessionChats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto gap-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <MessageSquare className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Fresh session — ask anything!</h3>
                  <p className="text-muted-foreground text-sm">
                    Your AI advisor knows you're in
                    <strong>{user?.location ? ` ${user.location}` : " your area"}</strong>,
                    it's currently <strong>{season}</strong>, and the weather is{" "}
                    <strong>{weather?.condition ?? "being fetched"}</strong>.
                  </p>
                </div>
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
              currentSessionChats.map((chat) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={chat.id}
                  className="space-y-5"
                >
                  {/* User bubble */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-md">
                      <p className="leading-relaxed">{chat.question}</p>
                      <p className="text-xs mt-1.5 text-primary-foreground/70 text-right">
                        {format(new Date(chat.createdAt!), "h:mm a")}
                      </p>
                    </div>
                    <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* AI bubble */}
                  <div className="flex gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Sprout className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-white border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                      <div className="prose prose-sm prose-green max-w-none text-foreground
                        prose-headings:font-semibold prose-headings:text-foreground prose-headings:mt-4 prose-headings:mb-2
                        prose-h3:text-base prose-h4:text-sm
                        prose-p:leading-relaxed prose-p:my-2
                        prose-ul:my-2 prose-ul:pl-4 prose-li:my-0.5
                        prose-ol:my-2 prose-ol:pl-4
                        prose-strong:text-foreground prose-strong:font-semibold
                        prose-hr:border-border prose-hr:my-3
                      ">
                        <ReactMarkdown>{chat.answer}</ReactMarkdown>
                      </div>
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

            <AnimatePresence>
              {chatMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-white border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
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
                placeholder={user?.location ? `Ask about farming in ${user.location}…` : "Type your farming question…"}
                className="flex-1 px-5 py-4 bg-muted/50 border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
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
        </>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === "history" && (
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-background/90">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pastChats.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No previous sessions yet</h3>
              <p className="text-sm text-muted-foreground">
                Your past conversations from previous login sessions will appear here. Start chatting and come back after logging in again!
              </p>
            </div>
          ) : (
            <div className="space-y-8 max-w-3xl mx-auto">
              {historyGroups.map(({ label, items }) => (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border/60" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                      {label}
                    </span>
                    <div className="h-px flex-1 bg-border/60" />
                  </div>
                  <div className="space-y-3">
                    {items.map((chat) => (
                      <HistoryCard
                        key={chat.id}
                        chat={chat}
                        location={user?.location}
                        season={season}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
