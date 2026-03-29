import { useState, useCallback, useRef, useEffect } from "react";
import type { MockTest } from "../data/mockData";

/**
 * Custom hook to manage test answers
 * Provides state management for answer selection and tracking
 *
 * @param testId - Unique identifier for the test
 * @returns Object with answer management methods and state
 *
 * @example
 * ```tsx
 * const { answers, selectAnswer, isAnswered, getAnswer, reset } = useTestAnswers('test-1');
 * ```
 */
export const useTestAnswers = (testId: string) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const selectAnswer = useCallback(
    (questionId: string, answerIndex: number) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: answerIndex,
      }));
    },
    []
  );

  const getAnswer = useCallback(
    (questionId: string): number | undefined => answers[questionId],
    [answers]
  );

  const isAnswered = useCallback(
    (questionId: string): boolean => {
      return questionId in answers;
    },
    [answers]
  );

  const reset = useCallback(() => {
    setAnswers({});
  }, []);

  const getAnsweredCount = useCallback((): number => {
    return Object.keys(answers).length;
  }, [answers]);

  const unansweredCount = useCallback(
    (totalQuestions: number): number => {
      return totalQuestions - Object.keys(answers).length;
    },
    [answers]
  );

  return {
    answers,
    selectAnswer,
    getAnswer,
    isAnswered,
    reset,
    getAnsweredCount,
    unansweredCount,
  };
};

/**
 * Custom hook for test timer
 * Manages countdown timer with pause/resume functionality
 *
 * @param durationInMinutes - Test duration in minutes
 * @param onTimeUp - Callback when time expires
 * @returns Object with timer state and controls
 *
 * @example
 * ```tsx
 * const { timeLeft, isRunning, start, pause, resume, reset } = useTestTimer(60);
 * ```
 */
export const useTestTimer = (
  durationInMinutes: number,
  onTimeUp?: () => void
) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTime = useRef(durationInMinutes * 60);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTimeUp]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(initialTime.current);
  }, []);

  const isTimeWarning = timeLeft < 5 * 60; // 5 minutes warning
  const isTimeCritical = timeLeft < 1 * 60; // 1 minute critical
  const isExpired = timeLeft === 0;

  return {
    timeLeft,
    isRunning,
    start,
    pause,
    resume,
    reset,
    isTimeWarning,
    isTimeCritical,
    isExpired,
    initialTime: initialTime.current,
  };
};

/**
 * Custom hook for test progress tracking
 * Monitors progress through a test (answered questions, navigation)
 *
 * @param test - The test object
 * @param answers - Current answers
 * @returns Object with progress information
 */
export const useTestProgress = (
  test: MockTest | undefined,
  answers: Record<string, number>
) => {
  const totalQuestions = test?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return {
    totalQuestions,
    answeredCount,
    unansweredCount,
    progressPercentage: Math.round(progressPercentage),
    isComplete: answeredCount === totalQuestions,
  };
};

/**
 * Custom hook to validate test submission
 * Checks if test can be submitted and provides validation messages
 *
 * @param test - The test object
 * @param answers - Current answers
 * @returns Object with validation info and submit readiness
 */
export const useTestValidation = (
  test: MockTest | undefined,
  answers: Record<string, number>
) => {
  const totalQuestions = test?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  const canSubmit = answeredCount > 0; // Allow submission with at least one answer

  const getValidationMessage = (): string => {
    if (!test) return "Test not found";
    if (answeredCount === 0) return "Please answer at least one question";
    if (answeredCount < totalQuestions) {
      return `You have ${totalQuestions - answeredCount} unanswered questions`;
    }
    return "Ready to submit";
  };

  const missingAnswersCount = Math.max(0, totalQuestions - answeredCount);

  return {
    canSubmit,
    validationMessage: getValidationMessage(),
    missingAnswersCount,
    answeredPercentage: totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0,
  };
};
