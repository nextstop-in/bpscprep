import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://66e2rvyfvj.execute-api.ap-south-1.amazonaws.com/prod";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor: Add authorization token
 */
apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Response interceptor: Global error handling and token refresh
 */
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: (token: string) => void;
  onError: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onError(error);
    } else {
      prom.onSuccess(token!);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized) - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((onSuccess, onError) => {
          failedQueue.push({ onSuccess, onError });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        return apiClient
          .post("/auth/refresh", { refreshToken })
          .then((response: any) => {
            const { accessToken, idToken } = response.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("idToken", idToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            processQueue(null, accessToken);
            return apiClient(originalRequest);
          })
          .catch((err) => {
            // Refresh failed, clear auth and redirect
            localStorage.removeItem("accessToken");
            localStorage.removeItem("idToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("bpsc_user");
            processQueue(err, null);
            // Optionally redirect to login
            window.location.href = "/login";
            return Promise.reject(err);
          });
      } else {
        // No refresh token, clear auth
        localStorage.removeItem("accessToken");
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("bpsc_user");
        processQueue(error, null);
        window.location.href = "/login";
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);
