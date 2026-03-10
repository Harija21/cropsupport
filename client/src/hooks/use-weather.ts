import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "./use-auth";

interface WeatherData {
  temp: number;
  condition: string;
  suggestion: string;
  location: string;
}

export function useWeather() {
  return useQuery<WeatherData>({
    queryKey: [api.weather.get.path],
    queryFn: async () => {
      const res = await fetchWithAuth(api.weather.get.path);
      return await res.json();
    },
  });
}
