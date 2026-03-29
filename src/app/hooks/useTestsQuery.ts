import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchMockTests, fetchTestDetails } from "../services/testService";
import type { MockTest } from "../data/mockData";
import { CACHE_CONFIG } from "../utils/constants";

/**
 * Custom hook to fetch and cache mock tests using React Query
 * Provides automatic caching, refetching, and error handling
 *
 * @returns UseQueryResult with tests data, loading, and error states
 *
 * @example
 * ```tsx
 * const { data: tests, isLoading, error } = useTestsQuery();
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorFallback error={error} />;
 *
 * return <TestList tests={tests} />;
 * ```
 */
export const useTestsQuery = (): UseQueryResult<MockTest[], Error> => {
  return useQuery({
    queryKey: ["tests"],
    queryFn: fetchMockTests,
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    retry: 2,
    retryDelay: CACHE_CONFIG.retryDelay,
  });
};

/**
 * Hook to fetch a single test by ID
 *
 * @param testId - The ID of the test to fetch
 * @returns UseQueryResult with test data
 */
export const useTestByIdQuery = (
  testId?: string
): UseQueryResult<MockTest | null, Error> => {
  return useQuery({
    queryKey: ["tests", testId],
    queryFn: async () => {
      if (!testId) return null;
      const tests = await fetchMockTests();
      return tests.find((t) => t.id === testId) || null;
    },
    enabled: !!testId,
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
  });
};

/**
 * Hook to fetch full mock tests only
 *
 * @returns UseQueryResult with full mock tests
 */
export const useFullMockTestsQuery = (): UseQueryResult<MockTest[], Error> => {
  return useQuery({
    queryKey: ["tests", "fullmock"],
    queryFn: async () => {
      const tests = await fetchMockTests();
      return tests.filter((t) => t.subject === "FULL");
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    retry: 2,
    retryDelay: CACHE_CONFIG.retryDelay,
  });
};

/**
 * Hook to fetch subject-wise tests (excluding full mock tests)
 *
 * @returns UseQueryResult with subject-wise tests
 */
export const useSubjectWiseTestsQuery = (): UseQueryResult<
  MockTest[],
  Error
> => {
  return useQuery({
    queryKey: ["tests", "subjectwise"],
    queryFn: async () => {
      const tests = await fetchMockTests();
      return tests.filter((t) => t.subject !== "FULL");
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    retry: 2,
    retryDelay: CACHE_CONFIG.retryDelay,
  });
};

/**
 * Hook to fetch tests filtered by subject
 *
 * @param subject - Subject name to filter by
 * @returns UseQueryResult with filtered tests
 */
export const useTestsBySubjectQuery = (
  subject?: string
): UseQueryResult<MockTest[], Error> => {
  return useQuery({
    queryKey: ["tests", "subject", subject],
    queryFn: async () => {
      if (!subject) return [];
      const tests = await fetchMockTests();
      return tests.filter((t) => t.subject === subject);
    },
    enabled: !!subject,
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
  });
};

/**
 * Hook to get all unique subjects from tests
 *
 * @returns UseQueryResult with list of subjects
 */
export const useSubjectsQuery = (): UseQueryResult<string[], Error> => {
  return useQuery({
    queryKey: ["tests", "subjects"],
    queryFn: async () => {
      const tests = await fetchMockTests();
      return Array.from(new Set(tests.map((t) => t.subject))).sort();
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
  });
};

/**
 * Hook to get test statistics
 *
 * @returns Object with test statistics
 */
export const useTestStatsQuery = (): UseQueryResult<
  {
    totalTests: number;
    totalQuestions: number;
    uniqueSubjects: number;
    averageDuration: number;
  },
  Error
> => {
  return useQuery({
    queryKey: ["tests", "stats"],
    queryFn: async () => {
      const tests = await fetchMockTests();
      const totalQuestions = tests.reduce((acc, t) => acc + t.totalQuestions, 0);
      const uniqueSubjects = new Set(tests.map((t) => t.subject)).size;
      const averageDuration =
        tests.reduce((acc, t) => acc + t.duration, 0) / tests.length;

      return {
        totalTests: tests.length,
        totalQuestions,
        uniqueSubjects,
        averageDuration: Math.round(averageDuration),
      };
    },
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
  });
};

/**
 * Hook to fetch test details with questions from the API
 * 
 * @param testId - The test ID to fetch details for
 * @returns UseQueryResult with test data including questions
 * 
 * @example
 * ```tsx
 * const { data: test, isLoading, error } = useTestDetailsQuery(testId);
 * 
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 * 
 * return <TestInterface test={test} />;
 * ```
 */
export const useTestDetailsQuery = (
  testId?: string
): UseQueryResult<MockTest, Error> => {
  return useQuery({
    queryKey: ["tests", "details", testId],
    queryFn: async () => {
      if (!testId) throw new Error("Test ID is required");
      return fetchTestDetails(testId);
    },
    enabled: !!testId,
    staleTime: CACHE_CONFIG.staleTime,
    gcTime: CACHE_CONFIG.gcTime,
    retry: 2,
    retryDelay: CACHE_CONFIG.retryDelay,
  });
};
