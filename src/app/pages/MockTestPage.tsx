import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { mockTests, Question, MockTest } from "../data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

export function MockTestPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if it's a custom test
  let test: MockTest | undefined = mockTests.find((t) => t.id === testId);

  if (!test && testId === "custom") {
    const customTestStr = localStorage.getItem("custom_test");
    if (customTestStr) {
      test = JSON.parse(customTestStr);
    }
  }

  // Check if test is expired
  const isTestExpired = (expiryDate?: string): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  useEffect(() => {
    if (test) {
      setTimeRemaining(test.duration * 60); // Convert minutes to seconds
    }
  }, [test]);

  useEffect(() => {
    if (timeRemaining > 0) {
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
  }, [timeRemaining]);

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Test not found</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  // Check if test is expired
  if (isTestExpired(test.expiryDate)) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Expired</h2>
          <p className="text-gray-600">
            This test expired on {new Date(test.expiryDate!).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitTest = () => {
    setIsSubmitting(true);

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
    };

    const existingResults = JSON.parse(localStorage.getItem("bpsc_results") || "[]");
    localStorage.setItem("bpsc_results", JSON.stringify([...existingResults, result]));

    navigate(`/dashboard/result/${resultId}`);
  };

  return (
    <div className="space-y-6">
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

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {test.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg border font-medium transition-colors ${
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
          ) : (
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
    </div>
  );
}