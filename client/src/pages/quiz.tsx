import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/components/quiz-question";
import { localStorageManager } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { Brain, CheckCircle, Trophy, Zap, Target } from "lucide-react";
import { Link } from "wouter";

interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

export default function Quiz() {
  const [currentUser, setCurrentUser] = useState(localStorageManager.getCurrentUser());
  const [quizState, setQuizState] = useState<'start' | 'active' | 'complete'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestionData[]>([]);

  const { data: questions = [], isLoading } = useQuery<QuizQuestionData[]>({
    queryKey: ['/api/quiz/questions'],
  });

  useEffect(() => {
    const user = localStorageManager.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const startQuiz = () => {
    if (questions.length === 0) return;
    
    // Select 10 random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(10, questions.length));
    
    setSelectedQuestions(selected);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setQuizState('active');
    
    localStorageManager.setQuizProgress({
      currentQuestion: 0,
      score: 0,
      answers: [],
      startTime: Date.now()
    });
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const question = selectedQuestions[currentQuestion];
    const isCorrect = optionIndex === question.correctAnswer;
    const newScore = score + (isCorrect ? 10 : 0);
    const newAnswers = [...answers, optionIndex];

    setScore(newScore);
    setAnswers(newAnswers);

    // Move to next question or finish quiz
    setTimeout(() => {
      if (currentQuestion + 1 < selectedQuestions.length) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        localStorageManager.setQuizProgress({
          currentQuestion: nextQuestion,
          score: newScore,
          answers: newAnswers,
          startTime: localStorageManager.getQuizProgress()?.startTime || Date.now()
        });
      } else {
        finishQuiz(newScore, newAnswers);
      }
    }, 1000);
  };

  const finishQuiz = (finalScore: number, finalAnswers: number[]) => {
    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return count + (answer === selectedQuestions[index].correctAnswer ? 1 : 0);
    }, 0);

    // Update user stats
    if (currentUser) {
      const newQuizzesCompleted = currentUser.quizzesCompleted + 1;
      const newTotalScore = currentUser.score + finalScore;
      const newBestStreak = Math.max(currentUser.bestStreak, correctCount);
      
      const updatedUser = localStorageManager.updateUserScore(
        newTotalScore,
        newQuizzesCompleted,
        newBestStreak
      );
      
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorageManager.updateLeaderboard(updatedUser);
      }

      // Save quiz result
      localStorageManager.saveQuizResult({
        score: finalScore,
        totalQuestions: selectedQuestions.length,
        correctAnswers: correctCount,
        completedAt: new Date().toISOString()
      });
    }

    localStorageManager.clearQuizProgress();
    setQuizState('complete');
  };

  const retakeQuiz = () => {
    setQuizState('start');
    localStorageManager.clearQuizProgress();
  };

  const getCorrectAnswers = () => {
    return answers.reduce((count, answer, index) => {
      return count + (answer === selectedQuestions[index]?.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl mb-4" data-testid="text-page-title">
            Recycling Knowledge Quiz
          </h1>
          <p className="text-muted-foreground text-lg">
            Test your waste sorting skills and earn points!
          </p>
        </div>

        {/* Quiz Stats */}
        {currentUser && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1">Current Score</h3>
                <p className="text-2xl font-bold text-primary" data-testid="text-current-score">
                  {currentUser.score}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-success/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1">Quizzes Completed</h3>
                <p className="text-2xl font-bold text-success" data-testid="text-quizzes-completed">
                  {currentUser.quizzesCompleted}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1">Best Streak</h3>
                <p className="text-2xl font-bold text-accent" data-testid="text-best-streak">
                  {currentUser.bestStreak}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quiz Interface */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Quiz Start */}
            {quizState === 'start' && (
              <div className="text-center">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-heading font-bold text-2xl mb-4" data-testid="text-quiz-start-title">
                  Ready to test your knowledge?
                </h2>
                <p className="text-muted-foreground mb-8" data-testid="text-quiz-start-description">
                  Answer {Math.min(10, questions.length)} questions about waste sorting and recycling to earn points and climb the leaderboard!
                </p>
                <Button 
                  onClick={startQuiz} 
                  className="bg-primary text-primary-foreground px-8 py-3 font-semibold hover:bg-primary/90"
                  disabled={questions.length === 0}
                  data-testid="button-start-quiz"
                >
                  Start Quiz
                </Button>
                {questions.length === 0 && (
                  <p className="text-muted-foreground text-sm mt-4">
                    No quiz questions available. Please check back later.
                  </p>
                )}
              </div>
            )}

            {/* Quiz Question */}
            {quizState === 'active' && selectedQuestions.length > 0 && (
              <QuizQuestion
                questionNumber={currentQuestion + 1}
                totalQuestions={selectedQuestions.length}
                question={selectedQuestions[currentQuestion]?.question}
                options={selectedQuestions[currentQuestion]?.options}
                currentScore={score}
                onAnswerSelect={handleAnswerSelect}
              />
            )}

            {/* Quiz Results */}
            {quizState === 'complete' && (
              <div className="text-center">
                <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="font-heading font-bold text-2xl mb-4" data-testid="text-quiz-complete-title">
                  Quiz Complete!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Great job! You've earned points for your eco-knowledge.
                </p>
                <Card className="bg-muted mb-8">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary" data-testid="text-final-score">
                          {score}
                        </p>
                        <p className="text-sm text-muted-foreground">Final Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success" data-testid="text-correct-answers">
                          {getCorrectAnswers()}/{selectedQuestions.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Correct Answers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-accent" data-testid="text-points-earned">
                          +{score}
                        </p>
                        <p className="text-sm text-muted-foreground">Points Earned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={retakeQuiz} 
                    className="bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90"
                    data-testid="button-retake-quiz"
                  >
                    Take Another Quiz
                  </Button>
                  <Link href="/leaderboard">
                    <Button 
                      variant="outline"
                      className="border-2 border-primary text-primary px-6 py-3 font-semibold hover:bg-primary hover:text-primary-foreground"
                      data-testid="button-view-leaderboard"
                    >
                      View Leaderboard
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
