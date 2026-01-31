import { z } from 'zod';
import { insertIssueSchema, insertMessageSchema, issues, messages } from './schema';

export const api = {
  issues: {
    list: {
      method: 'GET' as const,
      path: '/api/issues',
      responses: {
        200: z.array(z.custom<typeof issues.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/issues',
      input: insertIssueSchema,
      responses: {
        201: z.custom<typeof issues.$inferSelect>(),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/issues/:id',
      responses: {
        200: z.custom<typeof issues.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    simulateUpdate: {
      method: 'POST' as const,
      path: '/api/issues/:id/simulate',
      responses: {
        200: z.custom<typeof issues.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
    simulateDays: {
      method: 'POST' as const,
      path: '/api/simulate-days',
      input: z.object({ days: z.number() }),
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/messages',
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
  },
  analyze: {
    analyzeText: {
      method: 'POST' as const,
      path: '/api/analyze',
      input: z.object({ text: z.string() }),
      responses: {
        200: z.object({
          category: z.string(),
          importance: z.string(),
          department: z.string(),
          helpline: z.string(),
          actions: z.array(z.string()),
          riskLevel: z.enum(['low', 'medium', 'high']),
          advice: z.string(),
        }),
      },
    },
  },
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
