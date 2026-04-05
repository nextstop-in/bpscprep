import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "../hooks/useApi";
import type { Question, MockTest } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, BookOpen, FileText, ClipboardList, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Skeleton } from "../components/ui/skeleton";

interface ApiTestDetail {
  id: string;
  title?: string;
  subject?: string;
  duration: number;
  totalMarks?: number;
  totalQuestions?: number;
  questions: Array<{
    id: string | number;
    question: string;
    options: string[];
    correctAnswer?: number;
    subject?: string;
  }>;
  expiryDate?: string;
  year?: string;
  weekId?: string;
  weekNumber?: number;
}

interface SubmissionResult {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  totalQuestions: number;
  attemptId: string | null;
  submittedToApi: boolean;
  testId: string;
  testTitle: string;
  answers: Record<string, string>;
  attemptedAnswers: Array<{
    questionId: number;
    question: string;
    attemptedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
  timeTaken: number;
  date: string;
}

export function MockTestPage() {
  const { testId, reviewResultId } = useParams();
  const [searchParams] = useSearchParams();
  const isReviewMode = Boolean(reviewResultId);
  const weekIdFromUrl = searchParams.get('weekId') || undefined;

  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [submissionError, setSubmissionError] = useState<string>("");
  const [result, setResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    if (result || isReviewMode) return;

    const warningMessage = "You have an unfinished test. Leaving now will discard your progress.";

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = warningMessage;
      return warningMessage;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [result]);

  // Fetch test details directly from API using new useQuery pattern
  const { data: testDetails, loading: isLoading, error } = useQuery<any | ApiTestDetail>(
    `/tests/${testId}`,
    {},
    { enabled: !!testId }
  );

  const { data: reviewResult, loading: isReviewLoading, error: reviewError } = useQuery<any>(
    `/attempt/${reviewResultId}`,
    {},
    { enabled: isReviewMode }
  );

  const reviewAnswerMap = useMemo(() => {
    const map = new Map<string, any>();
    if (!reviewResult?.attemptedAnswers) return map;
    reviewResult.attemptedAnswers.forEach((answer: any) => {
      map.set(String(answer.questionId), answer);
      map.set(String(answer.questionId).replace(/^q/, ""), answer);
      map.set(String(answer.question).trim(), answer);
    });
    return map;
  }, [reviewResult]);

  // Transform API response to MockTest format
  const test = testDetails ? {
    id: testDetails.testId,
    title: testDetails.title || `Test ${testDetails.testId}`,
    subject: testDetails.subject || "",
    duration: testDetails.duration,
    totalMarks: testDetails.totalMarks || testDetails.questions.length,
    totalQuestions: testDetails.totalQuestions || testDetails.questions.length,
    questions: testDetails.questions.map((q: any, index: any) => ({
      id: typeof q.id === "string" ? q.id : `q${q.id || index + 1}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer ?? 0,
      subject: q.subject ?? "",
    })) || [],
    expiryDate: testDetails.expiryDate || "",
    year: testDetails.year || new Date().getFullYear().toString(),
    weekId: weekIdFromUrl || testDetails.weekId || "unknown",
    weekNumber: testDetails.weekNumber,
  } as MockTest : undefined;

  // Initialize timer when test data is loaded
  useEffect(() => {
    if (!test || isLoading || result) return;

    if (timeRemaining === null) {
      setTimeRemaining(test.duration * 60);
      return;
    }

    if (timerRef.current) return;

    timerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [test?.id, test?.duration, isLoading, result, timeRemaining]);

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

    const timeTaken = Math.max(test.duration * 60 - (timeRemaining ?? 0), 0);
    const weekId = weekIdFromUrl || test.weekId || "unknown";
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
      const response = await fetch("https://66e2rvyfvj.execute-api.ap-south-1.amazonaws.com/prod/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attemptPayload),
      });
      if (!response.ok) throw new Error("Submission failed");
      const responseData = await response.json();
      attemptId = responseData.attemptId || responseData.id;
      setSubmissionError("");
    } catch (error) {
      submittedToApi = false;
      setSubmissionError(
        "Unable to submit test to server. Result will be saved locally."
      );
    }

    if (!attemptId) {
      attemptId = `local-${Date.now()}`;
      submittedToApi = false;
    }

    // Calculate score locally for reference
    let correctAnswers = 0;
    const attemptedAnswers = test.questions.map((question, index) => {
      const selectedIndex = answers[question.id];
      const attemptedAnswer =
        selectedIndex !== undefined && selectedIndex !== null
          ? question.options[selectedIndex]
          : "";
      const correctAnswer = question.options[question.correctAnswer] || "";
      const isCorrect = selectedIndex === question.correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      return {
        questionId: index + 1,
        question: question.question,
        attemptedAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    const unanswered = test.questions.filter(
      (question) => answers[question.id] === undefined || answers[question.id] === null
    ).length;
    const wrongAnswers = Math.max(0, test.questions.length - correctAnswers - unanswered);
    const score = (correctAnswers / (test.questions.length || 1)) * 100;

    const submissionResult = {
      score,
      correctAnswers,
      wrongAnswers,
      unanswered,
      totalQuestions: test.questions.length,
      attemptId,
      submittedToApi,
      testId: test.id,
      testTitle: test.title,
      answers: payloadAnswers,
      attemptedAnswers,
      timeTaken,
      date: new Date().toISOString(),
    };

    const existingResults = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    localStorage.setItem("bpsc_results", JSON.stringify([...existingResults, submissionResult]));

    setIsSubmitting(false);
    navigate(`/home/result/${attemptId}`);
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: "Outstanding!", color: "text-green-600" };
    if (score >= 75) return { message: "Excellent Work!", color: "text-blue-600" };
    if (score >= 60) return { message: "Good Job!", color: "text-yellow-600" };
    if (score >= 40) return { message: "Keep Practicing!", color: "text-orange-600" };
    return { message: "Needs More Practice", color: "text-red-600" };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8 py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm">
            <BookOpen className="h-14 w-14 text-blue-700" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Preparing your exam</h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto">
            We’re loading the test paper, questions and answer sheet. Hold tight while we get everything ready.
          </p>
        </div>

        <div className="mx-auto flex max-w-xs items-end justify-center gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 140}ms` }}
              className="block h-10 w-3 rounded-full bg-blue-600/90 animate-bounce"
            />
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-700">Exam blueprint</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-200" />
            <div className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-700">Question set</span>
            </div>
            <div className="h-3 w-5/6 rounded-full bg-slate-200" />
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-700">Timer setup</span>
            </div>
            <div className="h-3 w-1/2 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !test) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Failed to Load Test</h2>
          <p className="text-gray-600">
            {error?.message || "Test not found. Please try again."}
          </p>
        </div>
        <Button onClick={() => navigate("/home")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  if (isReviewMode && isReviewLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading review details...</p>
      </div>
    );
  }

  if (isReviewMode && reviewError) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{reviewError?.message || "Unable to load review details."}</p>
        <Button onClick={() => navigate("/home")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  if (!test.questions || test.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No questions found in this test</p>
        <Button onClick={() => navigate("/home")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  if (result) {
    const performance = getPerformanceMessage(result.score);

    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
            <p className="text-blue-100">{result.testTitle}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${performance.color}`}>
                {result.score.toFixed(1)}%
              </div>
              <p className={`text-xl font-medium ${performance.color}`}>{performance.message}</p>
            </div>

            <Progress value={result.score} className="h-3 mb-6" />

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="font-bold text-green-700 text-2xl">{result.correctAnswers}</div>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="font-bold text-red-700 text-2xl">{result.wrongAnswers}</div>
                <p className="text-sm text-gray-600">Wrong</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-700 text-2xl">{result.unanswered}</div>
                <p className="text-sm text-gray-600">Unanswered</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-700 text-2xl">{result.totalQuestions}</div>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Time Taken</p>
                <p className="mt-2 text-lg font-semibold">{formatTime(result.timeTaken)}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Week ID</p>
                <p className="mt-2 text-lg font-semibold">{weekIdFromUrl || test.weekId || "unknown"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => navigate("/home")}>Back to Home</Button>
          <Button onClick={() => window.location.reload()}>Retake Test</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const currentReviewAttempt = reviewResult && currentQuestion
    ? reviewAnswerMap.get(String(currentQuestion.id))
        || reviewAnswerMap.get(String(currentQuestion.id).replace(/^q/, ""))
        || reviewAnswerMap.get(currentQuestion.question.trim())
    : undefined;

  const selectedReviewIndex = currentReviewAttempt
    ? currentQuestion.options.findIndex((option) => option === currentReviewAttempt.attemptedAnswer)
    : -1;

  const selectedValue = isReviewMode
    ? selectedReviewIndex >= 0
      ? selectedReviewIndex.toString()
      : undefined
    : answers[currentQuestion.id]?.toString();

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
                value={selectedValue}
                onValueChange={(value) => {
                  if (!isReviewMode) {
                    handleAnswerSelect(currentQuestion.id, parseInt(value));
                  }
                }}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrectOption = isReviewMode && index === currentQuestion.correctAnswer;
                    const isSelectedOption = isReviewMode && selectedReviewIndex === index;
                    const isWrongSelected = isReviewMode && isSelectedOption && index !== currentQuestion.correctAnswer;

                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                          isReviewMode
                            ? isCorrectOption
                              ? "border-green-400 bg-green-50"
                              : isWrongSelected
                                ? "border-red-400 bg-red-50"
                                : "border-gray-200 bg-white"
                            : answers[currentQuestion.id] === index
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                        } ${isReviewMode ? "cursor-default" : "cursor-pointer"}`}
                        onClick={() => {
                          if (!isReviewMode) handleAnswerSelect(currentQuestion.id, index);
                        }}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {isReviewMode && isCorrectOption && (
                          <span className="text-green-700 text-xs font-semibold">Correct Answer</span>
                        )}
                        {isReviewMode && isWrongSelected && (
                          <span className="text-red-700 text-xs font-semibold">Your Answer</span>
                        )}
                      </div>
                    );
                  })}
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

              {!isReviewMode && (
                <Button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit Test
                </Button>
              )}
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

          {isReviewMode && reviewResult && (
            <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={() => navigate("/home")}>
                Back to Home
              </Button>
              <Button onClick={() => navigate(`/home/test/${test.id}`)}>
                Retake Test
              </Button>
            </div>
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