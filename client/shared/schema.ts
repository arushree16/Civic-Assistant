// Client-side TypeScript types (no database dependencies)

import { z } from "zod";

// === TYPES ===

export interface Issue {
  id: number;
  description: string;
  category: string; // Waste, Water, Air, Transport, Energy
  location: string;
  status: string; // Reported, Forwarded, In Progress, Resolved
  affectedCount: number;
  daysUnresolved: number;
  createdAt: string;
  resolvedAt?: string;
  updates: Array<{ status: string; date: string; note?: string }>;
  userId?: string;
  lat?: number;
  lng?: number;
}

export interface Message {
  id: number;
  content: string;
  type: string;
  createdAt: string;
  userId?: string;
}

// === ZOD SCHEMAS ===

export const insertIssueSchema = z.object({
  description: z.string(),
  category: z.string(),
  location: z.string(),
  status: z.string().default("Reported"),
  affectedCount: z.number().default(1),
  userId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const insertMessageSchema = z.object({
  content: z.string(),
  type: z.string(),
  userId: z.string().optional(),
});

// === TYPES ===

export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type AnalyzeRequest = { text: string };
export type AnalyzeResponse = {
  category: string;
  importance: string;
  department: string;
  helpline: string;
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
  advice: string;
};
