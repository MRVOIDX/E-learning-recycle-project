import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertQuizQuestionSchema,
  insertRecyclingRuleSchema,
  insertRecyclingCenterSchema,
  insertQuizResultSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id/score", async (req, res) => {
    try {
      const { score, quizzesCompleted, bestStreak } = req.body;
      const user = await storage.updateUserScore(req.params.id, score, quizzesCompleted, bestStreak);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user score" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Quiz questions routes
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const { category } = req.query;
      const questions = category 
        ? await storage.getQuizQuestionsByCategory(category as string)
        : await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz questions" });
    }
  });

  app.post("/api/quiz/questions", async (req, res) => {
    try {
      const questionData = insertQuizQuestionSchema.parse(req.body);
      const question = await storage.createQuizQuestion(questionData);
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid question data" });
    }
  });

  app.patch("/api/quiz/questions/:id", async (req, res) => {
    try {
      const questionData = insertQuizQuestionSchema.partial().parse(req.body);
      const question = await storage.updateQuizQuestion(req.params.id, questionData);
      res.json(question);
    } catch (error) {
      res.status(400).json({ message: "Failed to update question" });
    }
  });

  app.delete("/api/quiz/questions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteQuizQuestion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Question not found" });
      }
      res.json({ message: "Question deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete question" });
    }
  });

  // Quiz results routes
  app.post("/api/quiz/results", async (req, res) => {
    try {
      const resultData = insertQuizResultSchema.parse(req.body);
      const result = await storage.saveQuizResult(resultData);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid result data" });
    }
  });

  app.get("/api/quiz/results/:userId", async (req, res) => {
    try {
      const results = await storage.getUserQuizResults(req.params.userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz results" });
    }
  });

  // Recycling rules routes
  app.get("/api/recycling/rules", async (req, res) => {
    try {
      const { category } = req.query;
      const rules = category 
        ? await storage.getRecyclingRulesByCategory(category as string)
        : await storage.getRecyclingRules();
      res.json(rules);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recycling rules" });
    }
  });

  app.post("/api/recycling/rules", async (req, res) => {
    try {
      const ruleData = insertRecyclingRuleSchema.parse(req.body);
      const rule = await storage.createRecyclingRule(ruleData);
      res.json(rule);
    } catch (error) {
      res.status(400).json({ message: "Invalid rule data" });
    }
  });

  app.patch("/api/recycling/rules/:id", async (req, res) => {
    try {
      const ruleData = insertRecyclingRuleSchema.partial().parse(req.body);
      const rule = await storage.updateRecyclingRule(req.params.id, ruleData);
      res.json(rule);
    } catch (error) {
      res.status(400).json({ message: "Failed to update rule" });
    }
  });

  app.delete("/api/recycling/rules/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRecyclingRule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Rule not found" });
      }
      res.json({ message: "Rule deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete rule" });
    }
  });

  // Recycling centers routes
  app.get("/api/recycling/centers", async (req, res) => {
    try {
      const { zipCode } = req.query;
      console.log(`[DEBUG] Recycling centers request: zipCode=${zipCode}`);
      const centers = zipCode 
        ? await storage.getRecyclingCentersByZip(zipCode as string)
        : await storage.getRecyclingCenters();
      console.log(`[DEBUG] Found ${centers.length} centers for zipCode=${zipCode}`);
      console.log(`[DEBUG] Centers:`, centers.map(c => ({ id: c.id, name: c.name, zipCode: c.zipCode })));
      res.json(centers);
    } catch (error) {
      console.error(`[DEBUG] Error getting recycling centers:`, error);
      res.status(500).json({ message: "Failed to get recycling centers" });
    }
  });

  app.post("/api/recycling/centers", async (req, res) => {
    try {
      const centerData = insertRecyclingCenterSchema.parse(req.body);
      const center = await storage.createRecyclingCenter(centerData);
      res.json(center);
    } catch (error) {
      res.status(400).json({ message: "Invalid center data" });
    }
  });

  app.patch("/api/recycling/centers/:id", async (req, res) => {
    try {
      const centerData = insertRecyclingCenterSchema.partial().parse(req.body);
      const center = await storage.updateRecyclingCenter(req.params.id, centerData);
      res.json(center);
    } catch (error) {
      res.status(400).json({ message: "Failed to update center" });
    }
  });

  app.delete("/api/recycling/centers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteRecyclingCenter(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Center not found" });
      }
      res.json({ message: "Center deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete center" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
