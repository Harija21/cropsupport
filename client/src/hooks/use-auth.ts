import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertUser, User } from "@shared/schema";

// Custom fetch wrapper to handle JWT injection
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    let errorMessage = "An error occurred";
    try {
      const errData = await res.json();
      errorMessage = errData.message || errorMessage;
    } catch {
      errorMessage = res.statusText;
    }
    throw new Error(errorMessage);
  }
  
  return res;
}

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      if (!localStorage.getItem("token")) return null;
      try {
        const res = await fetchWithAuth(api.auth.me.path);
        return await res.json();
      } catch (err) {
        localStorage.removeItem("token");
        return null;
      }
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" }));
        throw new Error(err.message);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      // Record the exact moment this login session started — used to show fresh chat
      localStorage.setItem("sessionStartTime", new Date().toISOString());
      queryClient.setQueryData(["/api/auth/me"], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData: InsertUser) => {
      const res = await fetch(api.auth.register.path, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Registration failed" }));
        throw new Error(err.message);
      }
      return await res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      // Record the exact moment this session started — used to show fresh chat
      localStorage.setItem("sessionStartTime", new Date().toISOString());
      queryClient.setQueryData(["/api/auth/me"], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionStartTime");
    queryClient.setQueryData(["/api/auth/me"], null);
    queryClient.clear();
  };
}

/** Returns the ISO timestamp from when the current login session started. */
export function getSessionStartTime(): string | null {
  return localStorage.getItem("sessionStartTime");
}
