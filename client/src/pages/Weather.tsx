import { useWeather } from "@/hooks/use-weather";
import { Loader2, CloudSun, Wind, Droplets, Thermometer, MapPin, Sprout, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function Weather() {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Fetching local micro-climate data...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center p-12 glass-panel rounded-3xl max-w-xl mx-auto mt-12">
        <CloudSun className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-foreground">Weather Data Unavailable</h2>
        <p className="text-muted-foreground mt-2">We couldn't fetch the weather for your location. Please check your profile settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-display text-foreground">Weather Advisory</h1>
        <p className="text-muted-foreground text-lg mt-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> {weather.location}
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-2xl shadow-sky-900/20"
      >
        <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <CloudSun className="w-64 h-64 md:w-96 md:h-96" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-medium text-sky-100 mb-2 capitalize">{weather.condition}</h2>
            <div className="text-7xl md:text-9xl font-display tracking-tighter mb-8">
              {weather.temp}°<span className="text-5xl md:text-7xl text-sky-200">C</span>
            </div>
            
            <div className="flex gap-6 mt-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl">
                <Droplets className="w-6 h-6 text-sky-200" />
                <div>
                  <div className="text-xs text-sky-200 uppercase tracking-wider font-semibold">Humidity</div>
                  <div className="text-lg font-bold">64%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl">
                <Wind className="w-6 h-6 text-sky-200" />
                <div>
                  <div className="text-xs text-sky-200 uppercase tracking-wider font-semibold">Wind</div>
                  <div className="text-lg font-bold">12 km/h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Agronomist Recommendation</h3>
            <p className="text-sky-50 text-lg leading-relaxed text-balance">
              {weather.suggestion}
            </p>
          </div>

        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards for future metrics */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Thermometer className="w-5 h-5 text-rose-500" /> Soil Temperature
          </div>
          <div className="text-2xl font-bold text-foreground">18°C</div>
          <div className="text-sm text-emerald-600 mt-1">Optimal for planting</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Droplets className="w-5 h-5 text-blue-500" /> Precipitation (24h)
          </div>
          <div className="text-2xl font-bold text-foreground">0 mm</div>
          <div className="text-sm text-amber-600 mt-1">Irrigation recommended</div>
        </div>
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Sun className="w-5 h-5 text-amber-500" /> UV Index
          </div>
          <div className="text-2xl font-bold text-foreground">High (7)</div>
          <div className="text-sm text-muted-foreground mt-1">Peak sunlight hours</div>
        </div>
      </div>
    </div>
  );
}

