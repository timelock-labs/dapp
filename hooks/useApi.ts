'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/userStore';
import type { ApiRequestOptions, UseApiReturn, ApiResponse } from '@/types';
import { useRouter } from 'next/navigation';

export function useApi(): UseApiReturn {
  const [data, setData] = useState<ApiResponse>({ data: null, success: false });
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken); // Get accessToken from useAuthStore

  
  const request = useCallback(async (url: string, options: ApiRequestOptions = {}, retryCount: number = 0) => {
    setIsLoading(true);
    setError(null);

    // Use relative URLs to leverage Next.js API rewrites
    const fullUrl = url.startsWith('http') ? url : (url.startsWith('/api') ? url : `/api${url.startsWith('/') ? '' : '/'}${url}`);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

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
        if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login on 401 Unauthorized
          return;
        }
        alert(
          'Error:\n' +
          `URL: ${fullUrl}\n` +
          `Headers: ${JSON.stringify(headers, null, 2)}\n` +
          `Body: ${JSON.stringify(options.body, null, 2)}\n` +
          `Error: ${error.message}`
        ); // Debugging line
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