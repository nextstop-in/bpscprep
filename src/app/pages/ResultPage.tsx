import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export interface AttemptResult {
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  testTitle: string;
  testId?: string;
  attemptedAnswers: Array<{
    questionId: number;
    question: string;
    attemptedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

export function ResultPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { submissionResult, weekId, apiResponse, testQuestions } = location.state || {};
  
  console.log("Result Page - testId:", testId, "weekId:", weekId, "submissionResult:", submissionResult, "apiResponse:", apiResponse);
  console.log("Result Page - first test question:", testQuestions);
  
  // Use apiResponse if available, otherwise fall back to submissionResult
  const responseData = apiResponse || submissionResult?.apiResponse;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (!responseData && !submissionResult) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Result not found</p>
        <Button onClick={() => navigate("/home")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  // Extract data from API response or submission result
  const score = responseData?.score ?? submissionResult?.score ?? 0;
  const attemptedAnswers = responseData?.attemptedAnswers ?? submissionResult?.attemptedAnswers ?? [];

  if (!attemptedAnswers || attemptedAnswers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No answers found in result</p>
        <Button onClick={() => navigate("/home")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const questions = Array.isArray(testQuestions) ? testQuestions : [];
  const totalQuestions = questions.length || attemptedAnswers.length;
  const answerMap = new Map<number, AttemptResult["attemptedAnswers"][number]>();
  attemptedAnswers.forEach((answer: any) => answerMap.set(answer.questionId, answer));

  const currentQuestion = questions[currentQuestionIndex];
  const questionKey = currentQuestion
    ? typeof currentQuestion.id === "number"
      ? currentQuestion.id
      : currentQuestionIndex + 1
    : currentQuestionIndex + 1;
  const currentAnswer = answerMap.get(questionKey) ?? answerMap.get(currentQuestionIndex + 1);

  const selectedOption = currentAnswer?.attemptedAnswer || "";
  const correctAnswerIndex = typeof currentQuestion?.correctAnswer === "number"
    ? currentQuestion.correctAnswer
    : Number(currentQuestion?.correctAnswer);
  const correctOption = typeof correctAnswerIndex === "number" && !Number.isNaN(correctAnswerIndex)
    ? currentQuestion?.options?.[correctAnswerIndex]
    : currentAnswer?.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const questionStatus = currentAnswer?.attemptedAnswer
    ? currentAnswer.isCorrect
      ? "Correct"
      : "Wrong"
    : "Unanswered";
  const questionBadgeClass = questionStatus === "Correct"
    ? "bg-green-100 text-green-700 border border-green-200"
    : questionStatus === "Wrong"
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-gray-100 text-gray-600 border border-gray-200";

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">Your Results</h2>
              <p className="text-blue-100">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1 text-white">
                {score.toFixed(2)}
              </div>
              <p className="text-blue-100 text-sm">Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {currentQuestionIndex + 1} of {totalQuestions} reviewed
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content - Two Column Layout (60/40) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Question (3 cols = 60%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Question */}
          <Card>
            <CardHeader>
              <div className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-700">
                <span className={`${questionBadgeClass} px-2 py-1 rounded-full text-[11px] font-semibold`}>{questionStatus}</span>
              </div>
              <CardTitle className="text-lg">
                Q{currentQuestionIndex + 1}. {currentQuestion?.question || currentAnswer?.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion?.options?.map((option: string, optionIndex: number) => {
                  const isSelected = selectedOption === option;
                  const isCorrectOption = correctOption === option;
                  const isWrongSelected = isSelected && selectedOption && selectedOption !== correctOption;
                  const isMarkedCorrect = isCorrectOption && (!selectedOption || selectedOption !== option || isSelected);

                  const baseClasses =
                    "rounded-lg border p-4 text-sm transition-colors flex items-center justify-between";
                  const styleClass = isSelected && isCorrectOption
                    ? "border-green-400 bg-green-50 text-green-700"
                    : isWrongSelected
                      ? "border-red-400 bg-red-50 text-red-700"
                      : isCorrectOption && selectedOption && selectedOption !== option
                        ? "border-green-400 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-900";

                  return (
                    <div key={optionIndex} className={`${baseClasses} ${styleClass}`}>
                      <span>{option}</span>
                      <span className="text-xs font-semibold uppercase tracking-wide">
                        {isSelected && "Your Answer"}
                        {!isSelected && isCorrectOption && selectedOption && "Correct"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentQuestionIndex < attemptedAnswers.length - 1 ? (
                <Button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : null}

              <Button
                onClick={() => navigate(`/home/test/${testId}?weekId=${encodeURIComponent(weekId)}`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Test
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Question Navigation (2 cols = 40%) */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-1">
                {Array.from({ length: totalQuestions }).map((_, index) => {
                  const question = questions[index];
                  const questionKey = question
                    ? typeof question.id === "number"
                      ? question.id
                      : index + 1
                    : index + 1;
                  const answer = answerMap.get(questionKey) ?? answerMap.get(index + 1);
                  const isUnanswered = !answer?.attemptedAnswer;
                  const isCorrect = Boolean(answer?.isCorrect);
                  const isWrong = Boolean(answer?.attemptedAnswer && !answer?.isCorrect);

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded border font-medium transition-colors text-xs cursor-pointer ${
                        index === currentQuestionIndex
                          ? "border-blue-500 bg-blue-500 text-white"
                          : isUnanswered
                          ? "border-gray-300 bg-gray-50 text-gray-700"
                          : isCorrect
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-red-500 bg-red-50 text-red-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50"></div>
                  <span className="text-gray-700">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-50"></div>
                  <span className="text-gray-700">Wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-50"></div>
                  <span className="text-gray-700">Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
