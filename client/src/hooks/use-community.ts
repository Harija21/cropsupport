import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { fetchWithAuth } from "./use-auth";
import type { CommunityPost, InsertCommunityPost } from "@shared/schema";

export function useCommunityPosts() {
  return useQuery<CommunityPost[]>({
    queryKey: [api.community.list.path],
    queryFn: async () => {
      const res = await fetchWithAuth(api.community.list.path);
      return await res.json();
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postData: InsertCommunityPost) => {
      const res = await fetchWithAuth(api.community.create.path, {
        method: api.community.create.method,
        body: JSON.stringify(postData),
      });
      return await res.json() as CommunityPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.community.list.path] });
    },
  });
}
