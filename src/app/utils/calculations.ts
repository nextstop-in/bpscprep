import type { MockTest, Question } from "../data/mockData";

/**
 * Calculate test score
 * @param test - The test object
 * @param answers - Object with questionId -> answerIndex mapping
 * @returns Score percentage (0-100)
 */
export const calculateTestScore = (
  test: MockTest,
  answers: Record<string, number>
): { score: number; correctAnswers: number; totalQuestions: number } => {
  if (!test.questions || test.questions.length === 0) {
    return { score: 0, correctAnswers: 0, totalQuestions: 0 };
  }

  let correctAnswers = 0;
  test.questions.forEach((question) => {
    if (answers[question.id] === question.correctAnswer) {
      correctAnswers++;
    }
  });

  const score = (correctAnswers / test.questions.length) * 100;

  return {
    score: Math.round(score * 100) / 100, // Round to 2 decimal places
    correctAnswers,
    totalQuestions: test.questions.length,
  };
};

/**
 * Format seconds to readable time format (HH:MM:SS)
 * @param seconds - Total seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  }
  return `${pad(minutes)}:${pad(secs)}`;
};

/**
 * Format time in seconds to a more human-readable format
 * @param seconds - Total seconds
 * @returns Display string like "5 mins", "1 hr 30 mins", etc
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

/**
 * Check if a test has expired
 * @param expiryDate - ISO date string
 * @returns true if test has expired, false otherwise
 */
export const isTestExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

/**
 * Get the next test deadline
 * @param expiryDate - ISO date string
 * @returns Days remaining or "Expired"
 */
export const getDaysUntilExpiry = (expiryDate?: string): string => {
  if (!expiryDate) return "No deadline";
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  
  if (diffTime < 0) return "Expired";
  
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;
};

/**
 * Get performance message based on score
 * @param score - Score percentage (0-100)
 * @returns Performance message
 */
export const getPerformanceMessage = (score: number): string => {
  if (score >= 90) return "Outstanding performance!";
  if (score >= 80) return "Excellent work!";
  if (score >= 70) return "Good effort!";
  if (score >= 60) return "Satisfactory performance";
  if (score >= 50) return "Need more practice";
  return "Keep practicing!";
};

/**
 * Get color for performance badge
 * @param score - Score percentage (0-100)
 * @returns Color class string
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-green-600 bg-green-50";
  if (score >= 80) return "text-blue-600 bg-blue-50";
  if (score >= 70) return "text-cyan-600 bg-cyan-50";
  if (score >= 60) return "text-yellow-600 bg-yellow-50";
  if (score >= 50) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
};

/**
 * Shuffle an array (Fisher-Yates shuffle)
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Sort tests by various criteria
 */
export const sortTests = (
  tests: MockTest[],
  sortBy: "recent" | "difficulty" | "expiry" | "subject" = "recent"
): MockTest[] => {
  const sorted = [...tests];

  switch (sortBy) {
    case "expiry":
      return sorted.sort(
        (a, b) =>
          new Date(b.expiryDate || "").getTime() -
          new Date(a.expiryDate || "").getTime()
      );

    case "subject":
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject));

    case "difficulty":
      // In future, if tests have difficulty ratings
      return sorted;

    case "recent":
    default:
      return sorted.reverse();
  }
};

/**
 * Group tests by subject
 */
export const groupTestsBySubject = (
  tests: MockTest[]
): Record<string, MockTest[]> => {
  return tests.reduce((acc, test) => {
    if (!acc[test.subject]) {
      acc[test.subject] = [];
    }
    acc[test.subject].push(test);
    return acc;
  }, {} as Record<string, MockTest[]>);
};

/**
 * Filter tests based on multiple criteria
 */
export const filterTests = (
  tests: MockTest[],
  filters: {
    subject?: string;
    excludeExpired?: boolean;
    minDuration?: number;
    maxDuration?: number;
  }
): MockTest[] => {
  return tests.filter((test) => {
    if (filters.subject && test.subject !== filters.subject) return false;
    if (filters.excludeExpired && isTestExpired(test.expiryDate)) return false;
    if (filters.minDuration && test.duration < filters.minDuration) return false;
    if (filters.maxDuration && test.duration > filters.maxDuration) return false;
    return true;
  });
};
