/**
 * Base API types and interfaces
 */

import type { HttpMethod } from '../common';

/**
 * Generic API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T | null;
  success: boolean;
  error?: ApiError;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Hook return type for API operations
 */
export interface UseApiReturn {
  data: ApiResponse;
  error: Error | null;
  isLoading: boolean;
  request: (url: string, options?: ApiRequestOptions, retryCount?: number) => Promise<any>;
}