import { apiClient } from "./apiClient";

export interface SignupResponse {
  success: boolean;
  data: {
    message: string;
    user: string;
  };
}

export interface ConfirmOTPResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    idToken: string;
  };
}

/**
 * Signup by sending OTP to email
 */
export async function sendSignupOTP(email: string, password: string): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/auth/signup", {
    email,
    password,
  });
  return response.data;
}

/**
 * Confirm OTP to complete signup
 */
export async function confirmOTP(email: string, code: string): Promise<ConfirmOTPResponse> {
  const response = await apiClient.post<ConfirmOTPResponse>("/auth/confirm", {
    email,
    code,
  });
  return response.data;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return response.data;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await apiClient.post<RefreshTokenResponse>("/auth/refresh", {
    refreshToken,
  });
  return response.data;
}
