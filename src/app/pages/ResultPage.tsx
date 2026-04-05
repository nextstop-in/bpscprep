import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle, XCircle, Home, RotateCcw, TrendingUp, Loader2 } from "lucide-react";
import { Progress } from "../components/ui/progress";

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
  const { resultId } = useParams();
  const navigate = useNavigate();

  // Fetch attempt result from API using new useQuery pattern
  const { data: apiResult, loading, error } = useQuery<AttemptResult>(
    `/attempt/${resultId}`,
    {},
    { enabled: !!resultId }
  );

  const fallbackResult = useMemo(() => {
    if (!resultId) return null;
    const stored = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    return stored.find((item: any) => item.attemptId === resultId) || null;
  }, [resultId]);

  const resultData = apiResult || fallbackResult;
  const resultError = error && !fallbackResult ? error : undefined;
  const isLoadingResult = loading && !fallbackResult;

  if (isLoadingResult) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading your results...</p>
      </div>
    );
  }

  if (resultError || !resultData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{resultError?.message || "Result not found"}</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const { score, correct, wrong, unanswered, testTitle, testId, attemptedAnswers: rawAttemptedAnswers } = resultData as AttemptResult & { attemptedAnswers?: any };
  const attemptedAnswers = rawAttemptedAnswers ?? [];
  const totalQuestions = correct + wrong + unanswered;

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding!", color: "text-green-600" };
    if (score >= 75) return { message: "Excellent Work!", color: "text-blue-600" };
    if (score >= 60) return { message: "Good Job!", color: "text-yellow-600" };
    return { message: "Review Your Answers", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(score);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <TrendingUp className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
          <p className="text-blue-100">{testTitle}</p>
        </CardContent>
      </Card>

      {/* Score Card */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
              {score.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mb-2">Raw Score</p>
            <p className={`text-xl font-medium ${performance.color}`}>{performance.message}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {correct}
                </span>
              </div>
              <p className="text-sm text-gray-600">Correct</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{wrong}</span>
              </div>
              <p className="text-sm text-gray-600">Wrong</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-600">
                  {unanswered}
                </span>
              </div>
              <p className="text-sm text-gray-600">Unanswered</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  {totalQuestions}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          {attemptedAnswers.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
              Detailed answer review is not available for this result.
            </div>
          ) : (
            <div className="space-y-4">
              {attemptedAnswers.map((answer: AttemptResult["attemptedAnswers"][number]) => (
                <div
                  key={answer.questionId}
                  className={`p-4 rounded-lg border ${
                    answer.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-2">
                      Q{answer.questionId}. {answer.question}
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Your Answer:</span>{" "}
                        <span
                          className={answer.isCorrect ? "text-green-700" : "text-red-700"}
                        >
                          {answer.attemptedAnswer}
                        </span>
                      </p>
                      {!answer.isCorrect && (
                        <p>
                          <span className="font-medium">Correct Answer:</span>{" "}
                          <span className="text-green-700">
                            {answer.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant={answer.isCorrect ? "default" : "destructive"}>
                    {answer.isCorrect ? "Correct" : "Incorrect"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate(`/home/test/${testId}/review/${resultId}`)}
          disabled={!testId}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Review Results
        </Button>
        <Button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retake Test
        </Button>
      </div>
    </div>
  );
}
