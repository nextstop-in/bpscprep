import { useQuery as useTanstackQuery, useMutation as useTanstackMutation, QueryKey } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { CACHE_CONFIG } from "../utils/constants";

/**
 * URL parameters type definition
 */
type Params = Record<string, any>;

/**
 * useQuery options type definition
 */
type UseQueryOptions<TData> = {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  select?: (data: any) => TData;
  retry?: number;
};

/**
 * useMutation options type definition
 */
type UseMutationOptions<TData, TError> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  retry?: number;
};

/**
 * Custom hook for data fetching with React Query and axios
 * Automatically applies default caching and retry configuration
 *
 * @param url - API endpoint URL
 * @param params - Query parameters to pass to the API
 * @param options - Optional configuration (enabled, staleTime, cacheTime, select, retry)
 * @returns Object with data, error, loading, isFetching, and refetch
 *
 * @example
 * ```tsx
 * // Fetch all tests
 * const { data: tests, loading, error } = useQuery("/tests");
 *
 * // Fetch with parameters
 * const { data: test } = useQuery("/tests/details", { testId: "123" });
 *
 * // Fetch with custom options
 * const { data, refetch } = useQuery("/tests", {}, {
 *   enabled: !!userId,
 *   retry: 3,
 *   staleTime: 1000 * 60 * 10
 * });
 * ```
 */
export function useQuery<TData = unknown>(
  url: string,
  params?: Params,
  options?: UseQueryOptions<TData>
) {
  const queryKey: QueryKey = [url, params];

  const fetcher = async (): Promise<TData> => {
    const response = await apiClient.get(url, { params });
    return response.data;
  };

  const query = useTanstackQuery<TData>({
    queryKey,
    queryFn: fetcher,
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? CACHE_CONFIG.staleTime,
    gcTime: options?.cacheTime ?? CACHE_CONFIG.gcTime,
    retry: options?.retry ?? 1,
    select: options?.select,
  });

  return {
    data: query.data,
    error: query.error,
    loading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

/**
 * Custom hook for API mutations with React Query and axios
 * Automatically applies error handling and retry configuration
 *
 * @param mutationFn - Async function that performs the mutation
 * @param options - Optional configuration (onSuccess, onError, retry)
 * @returns Object with mutate function, loading, error, and data
 *
 * @example
 * ```tsx
 * // Simple mutation
 * const { mutate, loading, error } = useMutation(
 *   async (payload) => apiClient.post("/tests/submit", payload)
 * );
 *
 * const handleSubmit = () => {
 *   mutate(attemptPayload, {
 *     onSuccess: (response) => {
 *       console.log("Success:", response);
 *     },
 *     onError: (error) => {
 *       console.error("Error:", error);
 *     }
 *   });
 * };
 *
 * // With type safety
 * const { mutate } = useMutation<SuccessResponse, Error, PayloadType>(
 *   async (payload) => {
 *     const response = await apiClient.post("/tests/submit", payload);
 *     return response.data;
 *   }
 * );
 * ```
 */
export function useMutation<TData = unknown, TError = Error, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError>
) {
  const mutation = useTanstackMutation<TData, TError, TVariables>({
    mutationFn,
    retry: options?.retry ?? 1,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
    isSuccess: mutation.isSuccess,
  };
}
