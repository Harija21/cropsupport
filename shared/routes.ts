import { z } from 'zod';
import { insertUserSchema, insertCommunityPostSchema, users, queries, diseaseReports, communityPosts } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
        400: errorSchemas.validation,
      }
    },
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ token: z.string(), user: z.custom<typeof users.$inferSelect>() }),
        401: errorSchemas.unauthorized,
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  },
  ai: {
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat' as const,
      input: z.object({ question: z.string() }),
      responses: {
        200: z.custom<typeof queries.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/ai/history' as const,
      responses: {
        200: z.array(z.custom<typeof queries.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    }
  },
  disease: {
    detect: {
      method: 'POST' as const,
      path: '/api/disease/detect' as const,
      // FormData upload, input schema omitted
      responses: {
        200: z.custom<typeof diseaseReports.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    history: {
      method: 'GET' as const,
      path: '/api/disease/history' as const,
      responses: {
        200: z.array(z.custom<typeof diseaseReports.$inferSelect>()),
        401: errorSchemas.unauthorized,
      }
    }
  },
  weather: {
    get: {
      method: 'GET' as const,
      path: '/api/weather' as const,
      responses: {
        200: z.object({
          temp: z.number(),
          condition: z.string(),
          suggestion: z.string(),
          location: z.string()
        }),
        401: errorSchemas.unauthorized,
      }
    }
  },
  community: {
    list: {
      method: 'GET' as const,
      path: '/api/community' as const,
      responses: {
        200: z.array(z.custom<typeof communityPosts.$inferSelect>()),
      }
    },
    create: {
      method: 'POST' as const,
      path: '/api/community' as const,
      input: insertCommunityPostSchema,
      responses: {
        201: z.custom<typeof communityPosts.$inferSelect>(),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
