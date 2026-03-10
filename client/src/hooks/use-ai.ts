import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "./use-auth";
import type { Query } from "@shared/schema";

export function useAiHistory() {
  return useQuery<Query[]>({
    queryKey: [api.ai.history.path],
    queryFn: async () => {
      const res = await fetchWithAuth(api.ai.history.path);
      return await res.json();
    },
  });
}

export function useAiChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (question: string) => {
      const res = await fetchWithAuth(api.ai.chat.path, {
        method: api.ai.chat.method,
        body: JSON.stringify({ question }),
      });
      return await res.json() as Query;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ai.history.path] });
    },
  });
}
