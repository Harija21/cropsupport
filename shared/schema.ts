import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
});

export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const diseaseReports = pgTable("disease_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url").notNull(),
  prediction: text("prediction").notNull(),
  advice: text("advice").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  authorName: text("author_name").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertQuerySchema = createInsertSchema(queries).omit({ id: true, createdAt: true });
export const insertDiseaseReportSchema = createInsertSchema(diseaseReports).omit({ id: true, createdAt: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, createdAt: true, authorName: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Query = typeof queries.$inferSelect;
export type DiseaseReport = typeof diseaseReports.$inferSelect;
export type CommunityPost = typeof communityPosts.$inferSelect;
