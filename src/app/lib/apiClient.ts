import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://66e2rvyfvj.execute-api.ap-south-1.amazonaws.com/prod";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor: Add authorization token
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response interceptor: Global error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optional: redirect to login
      console.warn("Unauthorized access - token cleared");
    }

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);
