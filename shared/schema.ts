import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  score: integer("score").notNull().default(0),
  quizzesCompleted: integer("quizzes_completed").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("easy"),
  imageUrl: text("image_url"),
});

export const recyclingRules = pgTable("recycling_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").array().notNull(),
  whatGoesIn: text("what_goes_in").array().notNull(),
  whatStaysOut: text("what_stays_out").array(),
  tips: text("tips").array(),
});

export const recyclingCenters = pgTable("recycling_centers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone"),
  hours: text("hours").notNull(),
  acceptedTypes: text("accepted_types").array().notNull(),
  distance: text("distance"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  correctAnswers: integer("correct_answers").notNull(),
  completedAt: timestamp("completed_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  question: true,
  options: true,
  correctAnswer: true,
  category: true,
  difficulty: true,
  imageUrl: true,
});

export const insertRecyclingRuleSchema = createInsertSchema(recyclingRules).pick({
  category: true,
  title: true,
  description: true,
  instructions: true,
  whatGoesIn: true,
  whatStaysOut: true,
  tips: true,
});

export const insertRecyclingCenterSchema = createInsertSchema(recyclingCenters).pick({
  name: true,
  address: true,
  zipCode: true,
  phone: true,
  hours: true,
  acceptedTypes: true,
  latitude: true,
  longitude: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  userId: true,
  score: true,
  totalQuestions: true,
  correctAnswers: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type RecyclingRule = typeof recyclingRules.$inferSelect;
export type RecyclingCenter = typeof recyclingCenters.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type InsertRecyclingRule = z.infer<typeof insertRecyclingRuleSchema>;
export type InsertRecyclingCenter = z.infer<typeof insertRecyclingCenterSchema>;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
