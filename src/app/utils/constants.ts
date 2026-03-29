/**
 * Application Constants
 * Centralized configuration for colors, messages, and other fixed values
 */

// ============================================================================
// Importance Levels & Colors
// ============================================================================

export const IMPORTANCE_LEVELS = {
  High: {
    label: "High",
    color: "bg-red-100 text-red-800",
    borderColor: "border-red-300",
    badge: "bg-red-500",
  },
  Medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-300",
    badge: "bg-yellow-500",
  },
  Low: {
    label: "Low",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-300",
    badge: "bg-green-500",
  },
} as const;

// ============================================================================
// Performance Levels & Colors
// ============================================================================

export const PERFORMANCE_LEVELS = {
  Outstanding: {
    score: { min: 90, max: 100 },
    message: "Outstanding performance!",
    color: "bg-green-50 text-green-700",
    borderColor: "border-green-300",
    bgColor: "bg-green-500",
  },
  Excellent: {
    score: { min: 80, max: 89 },
    message: "Excellent work!",
    color: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-300",
    bgColor: "bg-blue-500",
  },
  Good: {
    score: { min: 70, max: 79 },
    message: "Good effort!",
    color: "bg-cyan-50 text-cyan-700",
    borderColor: "border-cyan-300",
    bgColor: "bg-cyan-500",
  },
  Satisfactory: {
    score: { min: 60, max: 69 },
    message: "Satisfactory performance",
    color: "bg-yellow-50 text-yellow-700",
    borderColor: "border-yellow-300",
    bgColor: "bg-yellow-500",
  },
  NeedsPractice: {
    score: { min: 50, max: 59 },
    message: "Need more practice",
    color: "bg-orange-50 text-orange-700",
    borderColor: "border-orange-300",
    bgColor: "bg-orange-500",
  },
  Poor: {
    score: { min: 0, max: 49 },
    message: "Keep practicing!",
    color: "bg-red-50 text-red-700",
    borderColor: "border-red-300",
    bgColor: "bg-red-500",
  },
} as const;

// ============================================================================
// Subject Colors
// ============================================================================

export const SUBJECT_COLORS: Record<string, string> = {
  "Current Affairs": "from-blue-600 to-cyan-600",
  History: "from-amber-600 to-orange-600",
  Geography: "from-green-600 to-emerald-600",
  Polity: "from-purple-600 to-pink-600",
  Economics: "from-indigo-600 to-blue-600",
  Aptitude: "from-red-600 to-pink-600",
  Reasoning: "from-violet-600 to-purple-600",
  "English Grammar": "from-pink-600 to-rose-600",
  "General Studies": "from-slate-600 to-gray-600",
  Science: "from-cyan-600 to-blue-600",
} as const;

export const getSubjectColor = (subject: string): string => {
  return SUBJECT_COLORS[subject] || "from-gray-600 to-slate-600";
};

// ============================================================================
// Test Status Messages
// ============================================================================

export const TEST_STATUS = {
  Available: { label: "Available", icon: "CheckCircle", color: "text-green-600" },
  Expired: { label: "Expired", icon: "AlertCircle", color: "text-red-600" },
  Completed: { label: "Completed", icon: "CheckCircle", color: "text-blue-600" },
  InProgress: { label: "In Progress", icon: "Clock", color: "text-yellow-600" },
} as const;

// ============================================================================
// API Configuration
// ============================================================================

export const API_CONFIG = {
  baseUrl: "https://66e2rvyfvj.execute-api.ap-south-1.amazonaws.com/prod",
  timeout: 10000,
  retries: 3,
} as const;

// ============================================================================
// Pagination & Limits
// ============================================================================

export const PAGINATION = {
  defaultPageSize: 10,
  testsPerPage: 6,
  topicsPerPage: 8,
  resultsPerPage: 20,
} as const;

// ============================================================================
// Feature Flags
// ============================================================================

export const FEATURES = {
  enableAnalytics: true,
  enableNotifications: true,
  enableOfflineMode: false,
  enableExperimentalUI: false,
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  networkError: "Unable to connect. Please check your internet connection.",
  serverError: "Server error. Please try again later.",
  notFound: "The requested resource was not found.",
  unauthorized: "You are not authorized to access this resource.",
  invalidInput: "Please check your input and try again.",
  testsLoadFailed: "Failed to load tests. Please refresh the page.",
  testStartFailed: "Unable to start the test. Please try again.",
  resultsLoadFailed: "Failed to load results. Please refresh the page.",
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  testSubmitted: "Test submitted successfully!",
  resultsGenerated: "Results generated successfully!",
  settingsSaved: "Settings saved successfully!",
  profileUpdated: "Profile updated successfully!",
  loggedOut: "Logged out successfully!",
} as const;

// ============================================================================
// Navigation Routes
// ============================================================================

export const ROUTES = {
  root: "/",
  landing: "/",
  login: "/login",
  dashboard: "/dashboard",
  testStart: "/test/:testId",
  testReview: "/test/:testId/review",
  results: "/results",
  profile: "/profile",
  settings: "/settings",
  terms: "/terms",
  privacy: "/privacy",
} as const;

// ============================================================================
// Duration Presets (in minutes)
// ============================================================================

export const DURATION_PRESETS = [
  { label: "Quick (30 min)", value: 30 },
  { label: "Medium (60 min)", value: 60 },
  { label: "Long (90+ min)", value: 120 },
] as const;

// ============================================================================
// Difficulty Levels
// ============================================================================

export const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy", color: "text-green-600" },
  { value: "medium", label: "Medium", color: "text-yellow-600" },
  { value: "hard", label: "Hard", color: "text-red-600" },
] as const;

// ============================================================================
// Sorting Options
// ============================================================================

export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "expiry", label: "Expiring Soon" },
  { value: "subject", label: "By Subject" },
  { value: "difficulty", label: "By Difficulty" },
] as const;

// ============================================================================
// Time Limits (in seconds)
// ============================================================================

export const TIME_LIMITS = {
  minTestDuration: 15 * 60, // 15 minutes
  maxTestDuration: 180 * 60, // 3 hours
  warningTime: 5 * 60, // 5 minutes
} as const;

// ============================================================================
// Cache Configuration (for React Query)
// ============================================================================

export const CACHE_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
  retryDelay: 1000, // 1 second
} as const;

// ============================================================================
// Regex Patterns
// ============================================================================

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
} as const;
