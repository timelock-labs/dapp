'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase } from '@/hooks/useApiBase';
import type { ImportTimelockRequest, ContractStandard, TimelockContract } from '@/types';

/**
 * Hook for timelock API operations with standardized patterns
 *
 * @returns Object containing timelock API methods
 */
export const useTimelockApi = () => {
  // Mutations
  const importTimelockMutation = useApiMutation<TimelockContract, ImportTimelockRequest>(
    '/api/v1/timelock/create-or-import',
    'POST',
    { defaultErrorMessage: 'Failed to import timelock contract' }
  );

  const createTimelockMutation = useApiMutation<TimelockContract, ImportTimelockRequest>(
    '/api/v1/timelock/create-or-import',
    'POST',
    { defaultErrorMessage: 'Failed to create timelock contract' }
  );

  const updateTimelockRemarkMutation = useApiMutation<
    TimelockContract,
    {
      standard: ContractStandard;
      id: number;
      remark: string;
    }
  >(variables => `/api/v1/timelock/${variables.standard}/${variables.id}`, 'PUT', {
    defaultErrorMessage: 'Failed to update timelock remark',
  });

  const deleteTimelockMutation = useApiMutation<
    void,
    {
      standard: ContractStandard;
      id: number;
    }
  >(variables => `/api/v1/timelock/${variables.standard}/${variables.id}`, 'DELETE', {
    defaultErrorMessage: 'Failed to delete timelock contract',
  });

  // Queries
  const useTimelockList = (params?: {
    standard?: ContractStandard;
    status?: 'active' | 'inactive';
    enabled?: boolean;
  }) => {
    const queryString = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, value]) => value !== undefined) as [string, string][]
        ).toString()
      : '';

    const endpoint = `/api/v1/timelock/list${queryString ? `?${queryString}` : ''}`;

    return useApiBase<TimelockContract>(endpoint, {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch timelock list',
    });
  };

  const useTimelockDetail = (standard: ContractStandard, id: number) => {
    return useApiBase<TimelockContract>(`/api/v1/timelock/detail/${standard}/${id}`, {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch timelock details',
    });
  };

  // Compound-specific operations
  const compoundAdminPermissionsMutation = useApiMutation<unknown, { id: number }>(
    variables => `/api/v1/timelock/compound/${variables.id}/admin-permissions`,
    'GET',
    { defaultErrorMessage: 'Failed to fetch admin permissions' }
  );

  const setCompoundPendingAdminMutation = useApiMutation<
    void,
    {
      id: number;
      newPendingAdmin: string;
    }
  >(variables => `/api/v1/timelock/compound/${variables.id}/set-pending-admin`, 'POST', {
    defaultErrorMessage: 'Failed to set pending admin',
  });

  const acceptCompoundAdminMutation = useApiMutation<void, { id: number }>(
    variables => `/api/v1/timelock/compound/${variables.id}/accept-admin`,
    'POST',
    { defaultErrorMessage: 'Failed to accept admin role' }
  );

  // Convenience methods that wrap the mutations
  const importTimelock = useCallback(
    async (data: ImportTimelockRequest) => {
      try {
        const result = await importTimelockMutation.mutate(data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [importTimelockMutation]
  );

  const createTimelock = useCallback(
    async (data: ImportTimelockRequest) => {
      try {
        const result = await createTimelockMutation.mutate(data);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [createTimelockMutation]
  );

  const updateTimelockRemark = useCallback(
    async (standard: ContractStandard, id: number, remark: string) => {
      return updateTimelockRemarkMutation.mutate({
        standard,
        id,
        remark,
      });
    },
    [updateTimelockRemarkMutation]
  );

  const deleteTimelock = useCallback(
    async (standard: ContractStandard, id: number) => {
      return deleteTimelockMutation.mutate({ standard, id });
    },
    [deleteTimelockMutation]
  );

  const getCompoundAdminPermissions = useCallback(
    async (id: number) => {
      return compoundAdminPermissionsMutation.mutate({ id });
    },
    [compoundAdminPermissionsMutation]
  );

  const setCompoundPendingAdmin = useCallback(
    async (id: number, newPendingAdmin: string) => {
      return setCompoundPendingAdminMutation.mutate({ id, newPendingAdmin });
    },
    [setCompoundPendingAdminMutation]
  );

  const acceptCompoundAdmin = useCallback(
    async (id: number) => {
      return acceptCompoundAdminMutation.mutate({ id });
    },
    [acceptCompoundAdminMutation]
  );

  return {
    // Hooks for queries
    useTimelockList,
    useTimelockDetail,

    // Mutation methods
    importTimelock,
    createTimelock,
    updateTimelockRemark,
    deleteTimelock,
    getCompoundAdminPermissions,
    setCompoundPendingAdmin,
    acceptCompoundAdmin,

    // Mutation states
    importTimelockState: {
      data: importTimelockMutation.data,
      error: importTimelockMutation.error,
      isLoading: importTimelockMutation.isLoading,
    },
    createTimelockState: {
      data: createTimelockMutation.data,
      error: createTimelockMutation.error,
      isLoading: createTimelockMutation.isLoading,
    },
    updateTimelockRemarkState: {
      data: updateTimelockRemarkMutation.data,
      error: updateTimelockRemarkMutation.error,
      isLoading: updateTimelockRemarkMutation.isLoading,
    },
    deleteTimelockState: {
      data: deleteTimelockMutation.data,
      error: deleteTimelockMutation.error,
      isLoading: deleteTimelockMutation.isLoading,
    },
  };
};
