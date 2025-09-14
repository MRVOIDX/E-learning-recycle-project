import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { localStorageManager } from "@/lib/storage";
import { Trophy, Medal, Award, User, CheckCircle, Target, Zap, Star, Flame } from "lucide-react";

interface LeaderboardUser {
  id: string;
  username: string;
  score: number;
  quizzesCompleted: number;
  level: number;
  bestStreak: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState(localStorageManager.getCurrentUser());
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const user = localStorageManager.getCurrentUser();
    setCurrentUser(user);

    // Get leaderboard data
    const leaderboardData = localStorageManager.getLeaderboard();
    setLeaderboard(leaderboardData);

    // Find user rank
    if (currentUser) {
      const rank = leaderboardData.findIndex(user => user.id === currentUser.id) + 1;
      setUserRank(rank > 0 ? rank : leaderboardData.length + 1);
    }
  }, [currentUser]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold">{rank}</span>;
  };

  const getLevelTitle = (level: number) => {
    if (level >= 12) return "Eco Master";
    if (level >= 10) return "Eco Warrior";
    if (level >= 8) return "Eco Guardian";
    if (level >= 6) return "Eco Champion";
    if (level >= 4) return "Eco Enthusiast";
    return "Eco Beginner";
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 
      'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-gray-100'
    ];
    return colors[index % colors.length];
  };

  // Sample achievements based on user progress
  const achievements: Achievement[] = [
    {
      id: 'first-quiz',
      name: 'First Quiz',
      description: 'Complete your first quiz',
      icon: <CheckCircle className="w-6 h-6 text-accent" />,
      unlocked: (currentUser?.quizzesCompleted || 0) >= 1
    },
    {
      id: 'speed-runner',
      name: 'Speed Runner',
      description: 'Complete quiz in under 2 minutes',
      icon: <Zap className="w-6 h-6 text-success" />,
      unlocked: (currentUser?.bestStreak || 0) >= 5
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Score 100% on a quiz',
      icon: <Star className="w-6 h-6 text-primary" />,
      unlocked: (currentUser?.bestStreak || 0) >= 10
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Complete 10 quizzes in a row',
      icon: <Flame className="w-6 h-6 text-secondary" />,
      unlocked: (currentUser?.quizzesCompleted || 0) >= 10
    }
  ];

  return (
    <div className="fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl mb-4" data-testid="text-page-title">
            Eco Warriors Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg">
            See how you rank among fellow recycling champions!
          </p>
        </div>

        {/* User Rank Card */}
        {currentUser && (
          <Card className="bg-gradient-to-r from-primary to-secondary text-white mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="font-heading font-semibold text-xl mb-2" data-testid="text-user-rank-title">
                  Your Rank
                </h2>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold" data-testid="text-user-position">
                      #{userRank}
                    </p>
                    <p className="text-sm opacity-90">Position</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" data-testid="text-user-total-score">
                      {currentUser.score}
                    </p>
                    <p className="text-sm opacity-90">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" data-testid="text-user-level">
                      Level {currentUser.level}
                    </p>
                    <p className="text-sm opacity-90">Eco Level</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card className="shadow-lg overflow-hidden mb-12">
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h3 className="font-heading font-semibold text-lg">Top Eco Warriors</h3>
          </div>
          <div className="divide-y divide-border">
            {leaderboard.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leaderboard data yet. Complete some quizzes to appear here!</p>
              </div>
            ) : (
              leaderboard.slice(0, 50).map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors ${
                    currentUser?.id === user.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                  }`}
                  data-testid={`row-leaderboard-${index}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < 3 ? 'bg-transparent' : 'bg-muted'
                      }`}>
                        {getRankIcon(index + 1)}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(index)} flex items-center justify-center`}>
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold" data-testid={`text-user-name-${index}`}>
                        {user.username}
                        {currentUser?.id === user.id && (
                          <span className="ml-2 text-sm text-primary font-normal">(You)</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-user-level-${index}`}>
                        Level {user.level} {getLevelTitle(user.level)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" data-testid={`text-user-score-${index}`}>
                      {user.score}
                    </p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-user-quizzes-${index}`}>
                      {user.quizzesCompleted} quizzes
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Achievement Badges */}
        <div>
          <h3 className="font-heading font-semibold text-xl mb-6 text-center">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`text-center transition-all ${
                  achievement.unlocked 
                    ? 'shadow-sm hover:shadow-md border-primary/20' 
                    : 'opacity-50 grayscale'
                }`}
                data-testid={`card-achievement-${achievement.id}`}
              >
                <CardContent className="p-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {achievement.icon}
                  </div>
                  <p className="font-semibold text-sm mb-1" data-testid={`text-achievement-name-${achievement.id}`}>
                    {achievement.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`text-achievement-description-${achievement.id}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && (
                    <div className="mt-2">
                      <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
                        Unlocked
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
