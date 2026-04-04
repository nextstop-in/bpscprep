import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTestDetailsQuery } from "../hooks/useTestsQuery";
import type { Question, MockTest } from "../data/mockData";
import { submitAttempt } from "../services/testService";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

export function MockTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>("");



  // Fetch test details from API
  const { data: test, isLoading, error } = useTestDetailsQuery(testId);

  // Initialize timer when test data is loaded
  useEffect(() => {
    if (test) {
      setTimeRemaining(test.duration * 60); // Convert minutes to seconds
    }
  }, [test]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && test) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, test]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (test && currentQuestionIndex < test.totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (!test || !test.questions) return;

    setIsSubmitting(true);

    const payloadAnswers: Record<string, string> = {};
    test.questions.forEach((question, index) => {
      const userSelectedIndex = answers[question.id];
      if (userSelectedIndex !== undefined && userSelectedIndex !== null) {
        payloadAnswers[(index + 1).toString()] = question.options[userSelectedIndex];
      } else {
        payloadAnswers[(index + 1).toString()] = ""; // Mark unselected questions as empty string
      }
    });

    const timeTaken = Math.max(test.duration * 60 - timeRemaining, 0);
    const weekId = test.weekId || "unknown";
    const attemptPayload = {
      userId: user?.id || "user123",
      testId: test.id,
      weekId,
      answers: payloadAnswers,
      timeTaken,
    };

    let submittedToApi = true;
    let attemptId: string | null = null;
    try {
      const response = await submitAttempt(attemptPayload);
      attemptId = response.attemptId || response.id; // Assuming the response contains attemptId
      setSubmissionError("");
    } catch (error) {
      submittedToApi = false;
      setSubmissionError(
        "Unable to submit test to server. Result will be saved locally."
      );
    }

    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / test.questions.length) * 100;
    const resultId = Date.now().toString();

    // Save result to localStorage
    const result = {
      id: resultId,
      testId: test.id,
      testTitle: test.title,
      score,
      correctAnswers,
      totalQuestions: test.questions.length,
      answers,
      date: new Date().toISOString(),
      timeTaken,
      submittedToApi,
      attemptId,
    };

    const existingResults = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    localStorage.setItem("bpsc_results", JSON.stringify([...existingResults, result]));

    setIsSubmitting(false);
    navigate(`/dashboard/result/${resultId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error || !test) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Test</h2>
          <p className="text-gray-600">
            {error?.message || "Test not found. Please try again."}
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  if (!test.questions || test.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions found in this test</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{test.title}</h2>
              <p className="text-blue-100">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold mb-1">
                <Clock className="h-6 w-6" />
                {formatTime(timeRemaining)}
              </div>
              <p className="text-blue-100 text-sm">Time Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {answeredCount} of {test.questions.length} answered
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
              <CardTitle className="text-lg">
                Q{currentQuestionIndex + 1}. {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id] === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              {currentQuestionIndex < test.questions.length - 1 ? (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : null}

              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Test
              </Button>
            </div>
          </div>

          {answeredCount < test.questions.length && (
            <Alert>
              <AlertDescription>
                You have {test.questions.length - answeredCount} unanswered question(s). Make sure to
                answer all questions before submitting.
              </AlertDescription>
            </Alert>
          )}

          {submissionError && (
            <Alert variant="destructive">
              <AlertDescription>{submissionError}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right Sidebar - Question Navigation (2 cols = 40%) */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-1">
                {test.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded border font-medium transition-colors text-xs ${
                      index === currentQuestionIndex
                        ? "border-blue-500 bg-blue-500 text-white"
                        : answers[q.id] !== undefined
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500"></div>
                  <span className="text-gray-700">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50"></div>
                  <span className="text-gray-700">Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border-2 border-gray-300 bg-white"></div>
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