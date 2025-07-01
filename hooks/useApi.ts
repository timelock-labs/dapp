'use client';

import { useState, useCallback } from 'react';
import { useAuthStore } from '@/store/userStore'; // Import useAuthStore

type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: any;
}

interface UseApiReturn {
  data: ApiResponseOptions;
  error: Error | null;
  isLoading: boolean;
  request: (url: string, options?: ApiRequestOptions) => Promise<any>; // Changed return type to Promise<any>
}

interface ApiResponseOptions {
  data: any | null;
  error?: {
    code: string,
    details: string,
    message: string
  } | null;
  success: boolean;
}


export function useApi(): UseApiReturn {
  const [data, setData] = useState<ApiResponseOptions>({ data: null, success: false });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accessToken = useAuthStore((state) => state.accessToken); // Get accessToken from useAuthStore

  const request = useCallback(async (url: string, options: ApiRequestOptions = {}) => {
    setIsLoading(true);
    setError(null);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header for all requests except the login endpoint
    if (url !== '/api/v1/auth/wallet-connect' && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    console.log(accessToken, 'accessToken');
    console.log(headers, 'headers');
    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers: headers,
        body: options.body ? JSON.stringify(options.body) : null,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData; // Return responseData for direct use in components
    } catch (err: any) {
      setError(err);
      throw err; // Re-throw error so components can catch it if needed
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]); // Add accessToken to dependency array

  return { data, error, isLoading, request };
}