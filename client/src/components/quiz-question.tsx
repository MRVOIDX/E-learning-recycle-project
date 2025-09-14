import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  currentScore: number;
  onAnswerSelect: (optionIndex: number) => void;
}

export function QuizQuestion({ 
  questionNumber, 
  totalQuestions, 
  question, 
  options, 
  currentScore,
  onAnswerSelect 
}: QuizQuestionProps) {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span data-testid="text-question-progress">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span data-testid="text-quiz-score">Score: {currentScore}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" data-testid="progress-quiz" />
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-xl mb-6" data-testid="text-question">
            {question}
          </h2>
          <div className="space-y-3">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswerSelect(index)}
                className="quiz-option w-full p-4 text-left border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors bg-background text-foreground justify-start h-auto"
                data-testid={`button-quiz-option-${index}`}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
