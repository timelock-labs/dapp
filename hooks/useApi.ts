'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
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
  request: (url: string, options?: ApiRequestOptions, retryCount?: number) => Promise<any>; // Added retryCount parameter
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

  const request = useCallback(async (url: string, options: ApiRequestOptions = {}, retryCount: number = 0) => {
    setIsLoading(true);
    setError(null);

    // Use relative URLs to leverage Next.js API rewrites
    const fullUrl = url.startsWith('http') ? url : url;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header for all requests except the login endpoint
    if (url !== '/api/v1/auth/wallet-connect' && accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      try {
        const response = await axios.request({
          url: fullUrl,
          method: options.method || 'GET',
          headers: headers,
          data: options.body
        });

        setData(response.data);
        return response.data;
      } catch (error: any) {
        console.log(error.response?.data, 'errorData');
        throw error;
      }
    } catch (err: any) {
      setError(err);
      throw err; // Re-throw error so components can catch it if needed
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]); // Add accessToken to dependency array

  return { data, error, isLoading, request };
}