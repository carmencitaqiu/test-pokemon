// Generic API response type
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

// Error response type
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

