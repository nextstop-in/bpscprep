import { useEffect, useState } from "react";
import { fetchMockTests } from "../services/testService";

interface MockTest {
  id: string;
  title: string;
  subject: string;
  year?: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
}

interface UseTestsResult {
  tests: MockTest[];
  loading: boolean;
  error: Error | null;
}

export const useTests = (): UseTestsResult => {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      try {
        setLoading(true);
        const fetchedTests = await fetchMockTests();
        setTests(fetchedTests);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setTests([]);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  return { tests, loading, error };
};
