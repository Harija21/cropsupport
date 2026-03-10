import { useUser } from "@/hooks/use-auth";
import { useWeather } from "@/hooks/use-weather";
import { useAiHistory } from "@/hooks/use-ai";
import { useDiseaseHistory } from "@/hooks/use-disease";
import { format } from "date-fns";
import { CloudSun, Sprout, ShieldAlert, ArrowRight, Sun, CloudRain } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: weather, isLoading: weatherLoading } = useWeather();
  const { data: aiHistory } = useAiHistory();
  const { data: diseaseHistory } = useDiseaseHistory();

  const recentAi = aiHistory?.slice(0, 2) || [];
  const recentDisease = diseaseHistory?.slice(0, 2) || [];

  return (
    <div className="space-y-8 pb-10">
      <header>
        <h1 className="text-4xl font-display text-foreground">Welcome back, {user?.name}</h1>
        <p className="text-muted-foreground text-lg mt-2">Here is what's happening at your farm today.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-sky-50 to-white border-sky-100 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            {weather?.condition?.toLowerCase().includes('rain') ? (
              <CloudRain className="w-48 h-48" />
            ) : (
              <Sun className="w-48 h-48" />
            )}
          </div>
          
          <h2 className="text-lg font-semibold text-sky-900 flex items-center gap-2 mb-6">
            <CloudSun className="w-5 h-5" /> Local Weather Advisory
          </h2>
          
          {weatherLoading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-16 w-16 bg-sky-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-sky-200 rounded w-3/4"></div>
                <div className="h-4 bg-sky-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : weather ? (
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
              <div className="text-sky-950">
                <div className="text-6xl font-display">{weather.temp}°C</div>
                <div className="text-xl mt-1 capitalize">{weather.condition}</div>
                <div className="text-sm text-sky-700/80 mt-1">{weather.location}</div>
              </div>
              <div className="bg-white/60 p-4 rounded-2xl flex-1 backdrop-blur-sm border border-white">
                <h3 className="font-semibold text-sky-900 mb-1">Agronomist Suggestion</h3>
                <p className="text-sky-800 text-sm leading-relaxed">{weather.suggestion}</p>
              </div>
            </div>
          ) : (
            <p className="text-sky-800">Weather data unavailable.</p>
          )}
        </div>

        {/* Quick Action */}
        <div className="glass-panel p-6 rounded-3xl bg-primary text-primary-foreground flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-display mb-2">Spot a problem?</h2>
            <p className="text-primary-foreground/80 text-sm">Upload a photo of your crop to instantly identify diseases and get treatment advice.</p>
          </div>
          <Link href="/disease" className="mt-6">
            <button className="w-full py-3 bg-white text-primary rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg flex justify-center items-center gap-2">
              Detect Disease <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent AI Chats */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" /> Recent Advisor Chats
            </h2>
            <Link href="/ai" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          
          {recentAi.length > 0 ? (
            <div className="space-y-4">
              {recentAi.map((chat) => (
                <div key={chat.id} className="p-4 rounded-2xl bg-muted/50 border border-border/50">
                  <p className="font-medium text-foreground line-clamp-1 mb-1">Q: {chat.question}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">A: {chat.answer}</p>
                  <p className="text-xs text-muted-foreground mt-2">{format(new Date(chat.createdAt!), 'MMM d, h:mm a')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/30 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No recent conversations.</p>
            </div>
          )}
        </div>

        {/* Recent Disease Reports */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" /> Recent Scans
            </h2>
            <Link href="/disease" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          
          {recentDisease.length > 0 ? (
            <div className="space-y-4">
              {recentDisease.map((report) => (
                <div key={report.id} className="flex gap-4 p-3 rounded-2xl bg-muted/50 border border-border/50">
                  <img src={report.imageUrl} alt="Crop" className="w-16 h-16 rounded-xl object-cover bg-background" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{report.prediction}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{report.advice}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(report.createdAt!), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-muted/30 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground">No recent scans.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
