export interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  score: number;
  quizzesCompleted: number;
  bestStreak: number;
  level: number;
  createdAt: string;
  lastLogin: string;
}

export interface AuthSession {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  loginTime: string;
  isAuthenticated: boolean;
}

export interface QuizProgress {
  currentQuestion: number;
  score: number;
  answers: number[];
  startTime: number;
}

export class EcoSortStorage {
  private static instance: EcoSortStorage;

  static getInstance(): EcoSortStorage {
    if (!EcoSortStorage.instance) {
      EcoSortStorage.instance = new EcoSortStorage();
    }
    return EcoSortStorage.instance;
  }

  // User methods
  getCurrentUser(): LocalUser | null {
    const userData = window.localStorage.getItem('ecosort_user');
    return userData ? JSON.parse(userData) : null;
  }

  setCurrentUser(user: LocalUser): void {
    window.localStorage.setItem('ecosort_user', JSON.stringify(user));
  }

  createUser(username: string, email: string, password: string, role: 'user' | 'admin' = 'user'): LocalUser {
    const user: LocalUser = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password,
      role,
      score: 0,
      quizzesCompleted: 0,
      bestStreak: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    
    // Store user in users list
    const users = this.getAllUsers();
    users.push(user);
    this.setAllUsers(users);
    
    return user;
  }

  updateUserScore(score: number, quizzesCompleted: number, bestStreak: number): LocalUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const level = Math.floor(score / 1000) + 1;
    const updatedUser = { ...user, score, quizzesCompleted, bestStreak, level };
    this.setCurrentUser(updatedUser);
    
    // Also update the user in the all users list to maintain consistency
    this.updateUser(updatedUser);
    
    return updatedUser;
  }

  // Quiz progress methods
  getQuizProgress(): QuizProgress | null {
    const progress = window.localStorage.getItem('ecosort_quiz_progress');
    return progress ? JSON.parse(progress) : null;
  }

  setQuizProgress(progress: QuizProgress): void {
    window.localStorage.setItem('ecosort_quiz_progress', JSON.stringify(progress));
  }

  clearQuizProgress(): void {
    window.localStorage.removeItem('ecosort_quiz_progress');
  }

  // Leaderboard methods
  getLeaderboard(): LocalUser[] {
    const leaderboard = window.localStorage.getItem('ecosort_leaderboard');
    return leaderboard ? JSON.parse(leaderboard) : [];
  }

  updateLeaderboard(user: LocalUser): void {
    let leaderboard = this.getLeaderboard();
    
    // Remove existing entry for this user
    leaderboard = leaderboard.filter(u => u.id !== user.id);
    
    // Add updated user
    leaderboard.push(user);
    
    // Sort by score and keep top 50
    leaderboard = leaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
    
    window.localStorage.setItem('ecosort_leaderboard', JSON.stringify(leaderboard));
  }

  // Authentication methods
  login(email: string, password: string): LocalUser | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.updateUser(user);
      this.setAuthSession({
        userId: user.id,
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      });
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  logout(): void {
    window.localStorage.removeItem('ecosort_auth_session');
    window.localStorage.removeItem('ecosort_user');
  }

  isAuthenticated(): boolean {
    const session = this.getAuthSession();
    return session ? session.isAuthenticated : false;
  }

  isAdmin(): boolean {
    const session = this.getAuthSession();
    return session ? session.role === 'admin' : false;
  }

  getAuthSession(): AuthSession | null {
    const session = window.localStorage.getItem('ecosort_auth_session');
    return session ? JSON.parse(session) : null;
  }

  setAuthSession(session: AuthSession): void {
    window.localStorage.setItem('ecosort_auth_session', JSON.stringify(session));
  }

  getAllUsers(): LocalUser[] {
    const users = window.localStorage.getItem('ecosort_all_users');
    return users ? JSON.parse(users) : [];
  }

  setAllUsers(users: LocalUser[]): void {
    window.localStorage.setItem('ecosort_all_users', JSON.stringify(users));
  }

  updateUser(updatedUser: LocalUser): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.setAllUsers(users);
      
      // Update current user if it's the same
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.setCurrentUser(updatedUser);
      }
    }
  }

  userExists(email: string): boolean {
    const users = this.getAllUsers();
    return users.some(u => u.email === email);
  }

  // Initialize default admin user
  initializeDefaultAdmin(): void {
    const users = this.getAllUsers();
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
      this.createUser('admin', 'admin@ecosort.com', 'admin123', 'admin');
    }
  }

  // Settings methods
  getSettings(): Record<string, any> {
    const settings = window.localStorage.getItem('ecosort_settings');
    return settings ? JSON.parse(settings) : {
      theme: 'light',
      notifications: true,
      soundEffects: true,
    };
  }

  setSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    window.localStorage.setItem('ecosort_settings', JSON.stringify(settings));
  }

  // Quiz results methods
  saveQuizResult(result: {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completedAt: string;
  }): void {
    const results = this.getQuizResults();
    results.push({ ...result, id: Math.random().toString(36).substr(2, 9) });
    
    // Keep only last 50 results
    const limitedResults = results.slice(-50);
    window.localStorage.setItem('ecosort_quiz_results', JSON.stringify(limitedResults));
  }

  getQuizResults(): any[] {
    const results = window.localStorage.getItem('ecosort_quiz_results');
    return results ? JSON.parse(results) : [];
  }

  // Statistics methods
  getStatistics() {
    const results = this.getQuizResults();
    const user = this.getCurrentUser();
    
    if (!user || results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
        totalCorrectAnswers: 0,
      };
    }

    const totalQuizzes = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes;
    const bestScore = Math.max(...results.map(r => r.score));
    const totalCorrectAnswers = results.reduce((sum, r) => sum + r.correctAnswers, 0);

    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      bestScore,
      currentStreak: user.bestStreak,
      totalCorrectAnswers,
    };
  }
}

export const localStorageManager = EcoSortStorage.getInstance();

// Initialize default admin user when the module loads
localStorageManager.initializeDefaultAdmin();
