'use client';

import { useCallback, useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';

export interface ABIItem {
  id: number;
  name: string;
  description: string;
  abi_content: string;
  owner: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ABIListResponse {
  data: ABIItem[];
  error?: {
    code: string;
    details: string;
    message: string;
  };
  success: boolean;
}

export const useAbiApi = () => {
  const { request } = useApi();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [abiList, setAbiList] = useState<ABIItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createHeaders = useCallback(() => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  // Get ABI list
  const fetchAbiList = useCallback(async (): Promise<ABIItem[]> => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    setIsLoading(true);
    try {
      const response = await request('/api/v1/abi/list', {
        method: 'GET',
        headers: createHeaders(),
      });

      if (!response?.success) {
        throw new Error(response?.error?.message || 'Failed to fetch ABI list');
      }

      setAbiList(response.data);
      return response.data;
    } finally {
      setIsLoading(false);
    }
  }, [request, createHeaders, accessToken]);

  // Add new ABI
  const addAbi = useCallback(async (name: string, description: string, abiContent: string): Promise<ABIItem> => {
    const response = await request('/api/v1/abi/add', {
      method: 'POST',
      headers: createHeaders(),
      body: {
        name,
        description,
        abi_content: abiContent,
      },
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to add ABI');
    }

    // Refresh the list after adding
    await fetchAbiList();
    return response.data;
  }, [request, createHeaders, fetchAbiList]);

  // Delete ABI
  const deleteAbi = useCallback(async (id: number): Promise<void> => {
    const response = await request(`/api/v1/abi/${id}/delete`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to delete ABI');
    }

    // Refresh the list after deleting
    await fetchAbiList();
  }, [request, createHeaders, fetchAbiList]);

  // View ABI details
  const viewAbi = useCallback(async (id: number): Promise<ABIItem> => {
    const response = await request(`/api/v1/abi/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch ABI details');
    }

    return response.data;
  }, [request, createHeaders]);

  // Auto-fetch ABI list when accessToken is available
  useEffect(() => {
    if (accessToken) {
      fetchAbiList().catch(console.error);
    }
  }, [accessToken, fetchAbiList]);

  return {
    abiList,
    isLoading,
    fetchAbiList,
    addAbi,
    deleteAbi,
    viewAbi,
  };
};