import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Waste, Water, Air, Transport, Energy
  location: text("location").notNull(),
  status: text("status").notNull().default("Reported"), // Reported, Forwarded, In Progress, Resolved
  affectedCount: integer("affected_count").default(1),
  daysUnresolved: integer("days_unresolved").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  updates: jsonb("updates").$type<{ status: string; date: string; note?: string }[]>().default([]).notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// === SCHEMAS ===

export const insertIssueSchema = createInsertSchema(issues).omit({ 
  id: true, 
  createdAt: true,
  resolvedAt: true,
  updates: true 
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

// === TYPES ===

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Message = typeof messages.$inferSelect;
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
