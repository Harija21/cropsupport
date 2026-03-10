import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "./use-auth";
import type { DiseaseReport } from "@shared/schema";

export function useDiseaseHistory() {
  return useQuery<DiseaseReport[]>({
    queryKey: [api.disease.history.path],
    queryFn: async () => {
      const res = await fetchWithAuth(api.disease.history.path);
      return await res.json();
    },
  });
}

export function useDetectDisease() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      
      const res = await fetchWithAuth(api.disease.detect.path, {
        method: api.disease.detect.method,
        body: formData,
      });
      return await res.json() as DiseaseReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.disease.history.path] });
    },
  });
}
