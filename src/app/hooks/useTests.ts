import { useEffect, useState } from "react";
import { fetchMockTests } from "../services/testService";
import type { MockTest } from "../data/mockData";

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
