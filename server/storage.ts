import { 
  type User, 
  type InsertUser, 
  type QuizQuestion, 
  type InsertQuizQuestion,
  type RecyclingRule,
  type InsertRecyclingRule,
  type RecyclingCenter,
  type InsertRecyclingCenter,
  type QuizResult,
  type InsertQuizResult
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserScore(id: string, score: number, quizzesCompleted: number, bestStreak: number): Promise<User>;
  getLeaderboard(): Promise<User[]>;

  // Quiz methods
  getQuizQuestions(): Promise<QuizQuestion[]>;
  getQuizQuestionsByCategory(category: string): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  updateQuizQuestion(id: string, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion>;
  deleteQuizQuestion(id: string): Promise<boolean>;
  
  // Recycling rules methods
  getRecyclingRules(): Promise<RecyclingRule[]>;
  getRecyclingRulesByCategory(category: string): Promise<RecyclingRule[]>;
  createRecyclingRule(rule: InsertRecyclingRule): Promise<RecyclingRule>;
  updateRecyclingRule(id: string, rule: Partial<InsertRecyclingRule>): Promise<RecyclingRule>;
  deleteRecyclingRule(id: string): Promise<boolean>;

  // Recycling centers methods
  getRecyclingCenters(): Promise<RecyclingCenter[]>;
  getRecyclingCentersByZip(zipCode: string): Promise<RecyclingCenter[]>;
  createRecyclingCenter(center: InsertRecyclingCenter): Promise<RecyclingCenter>;
  updateRecyclingCenter(id: string, center: Partial<InsertRecyclingCenter>): Promise<RecyclingCenter>;
  deleteRecyclingCenter(id: string): Promise<boolean>;

  // Quiz results methods
  saveQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getUserQuizResults(userId: string): Promise<QuizResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizQuestions: Map<string, QuizQuestion>;
  private recyclingRules: Map<string, RecyclingRule>;
  private recyclingCenters: Map<string, RecyclingCenter>;
  private quizResults: Map<string, QuizResult>;

  constructor() {
    this.users = new Map();
    this.quizQuestions = new Map();
    this.recyclingRules = new Map();
    this.recyclingCenters = new Map();
    this.quizResults = new Map();
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default quiz questions
    const defaultQuestions: QuizQuestion[] = [
      {
        id: randomUUID(),
        question: "Which bin should plastic bottles go into?",
        options: ["General Waste", "Blue Recycling Bin", "Green Compost", "Red Hazardous"],
        correctAnswer: 1,
        category: "plastic",
        difficulty: "easy",
        imageUrl: null,
      },
      {
        id: randomUUID(),
        question: "What should you do before recycling glass jars?",
        options: ["Leave labels on", "Remove lids and clean", "Break into pieces", "Nothing special"],
        correctAnswer: 1,
        category: "glass",
        difficulty: "medium",
        imageUrl: null,
      },
      {
        id: randomUUID(),
        question: "Which of these items can go in organic waste?",
        options: ["Meat scraps", "Coffee grounds", "Plastic bags", "Aluminum cans"],
        correctAnswer: 1,
        category: "organic",
        difficulty: "easy",
        imageUrl: null,
      },
      {
        id: randomUUID(),
        question: "What is the most important step before disposing of old electronics?",
        options: ["Remove batteries", "Wipe personal data", "Break them down", "Clean thoroughly"],
        correctAnswer: 1,
        category: "ewaste",
        difficulty: "hard",
        imageUrl: null,
      },
    ];

    defaultQuestions.forEach(q => this.quizQuestions.set(q.id, q));

    // Initialize default recycling rules
    const defaultRules: RecyclingRule[] = [
      {
        id: randomUUID(),
        category: "plastic",
        title: "Plastic Waste Sorting",
        description: "Learn proper plastic recycling techniques",
        instructions: ["Remove caps and lids", "Rinse clean of food residue", "Check recycling number", "Place in designated bin"],
        whatGoesIn: ["Water bottles", "Food containers", "Milk jugs", "Detergent bottles"],
        whatStaysOut: ["Plastic bags", "Styrofoam", "Broken plastic toys"],
        tips: ["Plastic bottles can be recycled multiple times", "Look for the recycling number on the bottom"],
      },
      {
        id: randomUUID(),
        category: "glass",
        title: "Glass Waste Sorting",
        description: "Glass recycling guidelines and best practices",
        instructions: ["Remove all caps and lids", "Empty contents completely", "Quick rinse (no soap needed)", "Sort by color if required"],
        whatGoesIn: ["Glass bottles", "Food jars", "Beverage containers", "Cosmetic jars"],
        whatStaysOut: ["Window glass", "Light bulbs", "Mirrors", "Ceramics"],
        tips: ["Glass can be recycled infinitely without losing quality", "It takes about 30 days to go from bin to shelf"],
      },
      {
        id: randomUUID(),
        category: "organic",
        title: "Organic Waste Composting",
        description: "Composting organic waste for environmental benefit",
        instructions: ["Separate food scraps", "Add yard waste", "Keep meat and dairy out", "Turn compost regularly"],
        whatGoesIn: ["Fruit and vegetable scraps", "Coffee grounds and filters", "Eggshells", "Yard trimmings"],
        whatStaysOut: ["Meat and dairy products", "Pet waste", "Diseased plants", "Treated wood"],
        tips: ["Organic waste makes up 30% of household trash", "Compost creates nutrient-rich soil"],
      },
      {
        id: randomUUID(),
        category: "ewaste",
        title: "Electronic Waste (E-waste)",
        description: "Safe disposal of electronic devices and components",
        instructions: ["Wipe personal data", "Remove batteries if possible", "Take to certified center", "Never put in regular trash"],
        whatGoesIn: ["Old smartphones and tablets", "Computer equipment", "Batteries (all types)", "Small appliances"],
        whatStaysOut: ["Items with personal data intact", "Damaged batteries", "Large appliances without arrangement"],
        tips: ["E-waste contains valuable metals like gold and silver", "Proper recycling prevents toxic materials from landfills"],
      },
    ];

    defaultRules.forEach(r => this.recyclingRules.set(r.id, r));

    // Initialize empty recycling centers - admins will add them via dashboard
    const defaultCenters: RecyclingCenter[] = [];

    defaultCenters.forEach(c => this.recyclingCenters.set(c.id, c));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      score: 0,
      quizzesCompleted: 0,
      bestStreak: 0,
      level: 1,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserScore(id: string, score: number, quizzesCompleted: number, bestStreak: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const level = Math.floor(score / 1000) + 1;
    const updatedUser = { ...user, score, quizzesCompleted, bestStreak, level };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }

  // Quiz methods
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values());
  }

  async getQuizQuestionsByCategory(category: string): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(q => q.category === category);
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = randomUUID();
    const question: QuizQuestion = { 
      ...insertQuestion, 
      id,
      difficulty: insertQuestion.difficulty || "easy",
      imageUrl: insertQuestion.imageUrl || null
    };
    this.quizQuestions.set(id, question);
    return question;
  }

  async updateQuizQuestion(id: string, updateData: Partial<InsertQuizQuestion>): Promise<QuizQuestion> {
    const question = this.quizQuestions.get(id);
    if (!question) throw new Error("Question not found");
    
    const updatedQuestion = { ...question, ...updateData };
    this.quizQuestions.set(id, updatedQuestion);
    return updatedQuestion;
  }

  async deleteQuizQuestion(id: string): Promise<boolean> {
    return this.quizQuestions.delete(id);
  }

  // Recycling rules methods
  async getRecyclingRules(): Promise<RecyclingRule[]> {
    return Array.from(this.recyclingRules.values());
  }

  async getRecyclingRulesByCategory(category: string): Promise<RecyclingRule[]> {
    return Array.from(this.recyclingRules.values()).filter(r => r.category === category);
  }

  async createRecyclingRule(insertRule: InsertRecyclingRule): Promise<RecyclingRule> {
    const id = randomUUID();
    const rule: RecyclingRule = { 
      ...insertRule, 
      id,
      whatStaysOut: insertRule.whatStaysOut || null,
      tips: insertRule.tips || null
    };
    this.recyclingRules.set(id, rule);
    return rule;
  }

  async updateRecyclingRule(id: string, updateData: Partial<InsertRecyclingRule>): Promise<RecyclingRule> {
    const rule = this.recyclingRules.get(id);
    if (!rule) throw new Error("Rule not found");
    
    const updatedRule = { ...rule, ...updateData };
    this.recyclingRules.set(id, updatedRule);
    return updatedRule;
  }

  async deleteRecyclingRule(id: string): Promise<boolean> {
    return this.recyclingRules.delete(id);
  }

  // Recycling centers methods
  async getRecyclingCenters(): Promise<RecyclingCenter[]> {
    return Array.from(this.recyclingCenters.values());
  }

  async getRecyclingCentersByZip(zipCode: string): Promise<RecyclingCenter[]> {
    return Array.from(this.recyclingCenters.values()).filter(c => 
      c.zipCode === zipCode || c.zipCode.substring(0, 3) === zipCode.substring(0, 3)
    );
  }

  async createRecyclingCenter(insertCenter: InsertRecyclingCenter): Promise<RecyclingCenter> {
    const id = randomUUID();
    const center: RecyclingCenter = { 
      ...insertCenter, 
      id, 
      distance: null,
      phone: insertCenter.phone || null,
      latitude: insertCenter.latitude || null,
      longitude: insertCenter.longitude || null
    };
    this.recyclingCenters.set(id, center);
    return center;
  }

  async updateRecyclingCenter(id: string, updateData: Partial<InsertRecyclingCenter>): Promise<RecyclingCenter> {
    const center = this.recyclingCenters.get(id);
    if (!center) throw new Error("Center not found");
    
    const updatedCenter = { ...center, ...updateData };
    this.recyclingCenters.set(id, updatedCenter);
    return updatedCenter;
  }

  async deleteRecyclingCenter(id: string): Promise<boolean> {
    return this.recyclingCenters.delete(id);
  }

  // Quiz results methods
  async saveQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = randomUUID();
    const result: QuizResult = { ...insertResult, id, completedAt: new Date() };
    this.quizResults.set(id, result);
    return result;
  }

  async getUserQuizResults(userId: string): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(r => r.userId === userId);
  }
}

export const storage = new MemStorage();
