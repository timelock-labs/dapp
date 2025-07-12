'use client';

import { useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';
import { ImportTimelockRequest } from '@/hooks/useTimelockImport';

export interface TimelockApiResponse {
  data?: any;
  error?: {
    code: string;
    details: string;
    message: string;
  };
  success: boolean;
}

export const useTimelockApi = () => {
  const { request } = useApi();
  const { accessToken } = useAuthStore();

  const createHeaders = useCallback(() => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  /**
   * Import existing timelock contract
   */
  const importTimelock = useCallback(async (data: ImportTimelockRequest): Promise<TimelockApiResponse> => {
    try {
      const response = await request('/api/v1/timelock/import', {
        method: 'POST',
        headers: createHeaders(),
        body: data,
      });

      return response;
    } catch (error) {
      console.error('Error importing timelock:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Create new timelock contract record
   */
  const createTimelock = useCallback(async (data: ImportTimelockRequest): Promise<TimelockApiResponse> => {
    try {
      const response = await request('/api/v1/timelock/create', {
        method: 'POST',
        headers: createHeaders(),
        body: data,
      });

      return response;
    } catch (error) {
      console.error('Error creating timelock:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Get timelock list
   */
  const getTimelockList = useCallback(async (params?: {
    standard?: 'compound' | 'openzeppelin';
    status?: 'active' | 'inactive';
  }): Promise<TimelockApiResponse> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.standard) queryParams.append('standard', params.standard);
      if (params?.status) queryParams.append('status', params.status);

      const url = `/api/v1/timelock/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await request(url, {
        method: 'GET',
        headers: createHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Error fetching timelock list:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Get timelock detail
   */
  const getTimelockDetail = useCallback(async (
    standard: 'compound' | 'openzeppelin',
    id: number
  ): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/detail/${standard}/${id}`, {
        method: 'GET',
        headers: createHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Error fetching timelock detail:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Update timelock remark
   */
  const updateTimelockRemark = useCallback(async (
    standard: 'compound' | 'openzeppelin',
    id: number,
    remark: string
  ): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/${standard}/${id}`, {
        method: 'PUT',
        headers: createHeaders(),
        body: {
          id,
          remark,
          standard,
        },
      });

      return response;
    } catch (error) {
      console.error('Error updating timelock remark:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Delete timelock
   */
  const deleteTimelock = useCallback(async (
    standard: 'compound' | 'openzeppelin',
    id: number
  ): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/${standard}/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Error deleting timelock:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Get Compound admin permissions
   */
  const getCompoundAdminPermissions = useCallback(async (id: number): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/compound/${id}/admin-permissions`, {
        method: 'GET',
        headers: createHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Error fetching admin permissions:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Set pending admin for Compound timelock
   */
  const setCompoundPendingAdmin = useCallback(async (
    id: number,
    newPendingAdmin: string
  ): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/compound/${id}/set-pending-admin`, {
        method: 'POST',
        headers: createHeaders(),
        body: {
          id,
          new_pending_admin: newPendingAdmin,
        },
      });

      return response;
    } catch (error) {
      console.error('Error setting pending admin:', error);
      throw error;
    }
  }, [request, createHeaders]);

  /**
   * Accept admin for Compound timelock
   */
  const acceptCompoundAdmin = useCallback(async (id: number): Promise<TimelockApiResponse> => {
    try {
      const response = await request(`/api/v1/timelock/compound/${id}/accept-admin`, {
        method: 'POST',
        headers: createHeaders(),
      });

      return response;
    } catch (error) {
      console.error('Error accepting admin:', error);
      throw error;
    }
  }, [request, createHeaders]);

  return {
    importTimelock,
    createTimelock,
    getTimelockList,
    getTimelockDetail,
    updateTimelockRemark,
    deleteTimelock,
    getCompoundAdminPermissions,
    setCompoundPendingAdmin,
    acceptCompoundAdmin,
  };
};