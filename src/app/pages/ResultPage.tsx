import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { mockTests } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle, XCircle, Home, RotateCcw, TrendingUp } from "lucide-react";
import { Progress } from "../components/ui/progress";

interface Result {
  id: string;
  testId: string;
  testTitle: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: { [key: string]: number };
  date: string;
}

export function ResultPage() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    const foundResult = results.find((r: Result) => r.id === resultId);
    setResult(foundResult || null);
  }, [resultId]);

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Result not found</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const test = mockTests.find((t) => t.id === result.testId);
  const percentage = result.score;
  const incorrectAnswers = result.totalQuestions - result.correctAnswers;

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding!", color: "text-green-600" };
    if (score >= 75) return { message: "Excellent Work!", color: "text-blue-600" };
    if (score >= 60) return { message: "Good Job!", color: "text-yellow-600" };
    if (score >= 40) return { message: "Keep Practicing!", color: "text-orange-600" };
    return { message: "Need More Practice", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(percentage);

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
          <p className="text-blue-100">{result.testTitle}</p>
        </CardContent>
      </Card>

      {/* Score Card */}
      <Card>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
              {percentage.toFixed(1)}%
            </div>
            <p className={`text-xl font-medium ${performance.color}`}>{performance.message}</p>
          </div>

          <Progress value={percentage} className="h-3 mb-6" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {result.correctAnswers}
                </span>
              </div>
              <p className="text-sm text-gray-600">Correct</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">{incorrectAnswers}</span>
              </div>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl font-bold text-blue-600">
                  {result.totalQuestions}
                </span>
              </div>
              <p className="text-sm text-gray-600">Total Questions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      {test && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {test.questions.map((question, index) => {
                const userAnswer = result.answers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          Q{index + 1}. {question.question}
                        </p>
                        <div className="space-y-2 text-sm">
                          {userAnswer !== undefined && (
                            <p>
                              <span className="font-medium">Your Answer:</span>{" "}
                              <span
                                className={isCorrect ? "text-green-700" : "text-red-700"}
                              >
                                {question.options[userAnswer]}
                              </span>
                            </p>
                          )}
                          {!isCorrect && (
                            <p>
                              <span className="font-medium">Correct Answer:</span>{" "}
                              <span className="text-green-700">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant={isCorrect ? "default" : "destructive"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => navigate("/")} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        {test && (
          <Button
            onClick={() => navigate(`/mock-test/${test.id}`)}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Test
          </Button>
        )}
      </div>
    </div>
  );
}
