'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase } from '@/hooks/useApiBase';
import type { ABIItem, ABIListResponse } from '@/types';

/**
 * Hook for ABI API operations with standardized patterns
 *
 * @returns Object containing ABI API methods and hooks
 */
export const useAbiApi = () => {
	// Query hooks
	const useAbiList = () => {
		const { data, error, isLoading, refetch, isInitialized } = useApiBase<ABIListResponse>(
			'/api/v1/abi/list',
			{
				autoFetch: true,
				defaultErrorMessage: 'Failed to fetch ABI list',
			}
		);

		// Transform the data to combine shared and user ABIs
		const abiList = data ? [...(data.shared_abis || []), ...(data.user_abis || [])] : [];

		return {
			abiList,
			error,
			isLoading,
			refetch,
			isInitialized,
		};
	};

	const useAbiDetail = (id: number) => {
		return useApiBase<ABIItem>(`/api/v1/abi/${id}`, {
			autoFetch: true,
			defaultErrorMessage: 'Failed to fetch ABI details',
		});
	};

	// Mutations
	const addAbiMutation = useApiMutation<
		ABIItem,
		{
			name: string;
			description: string;
			abi_content: string;
		}
	>('/api/v1/abi/add', 'POST', { defaultErrorMessage: 'Failed to add ABI' });

	const deleteAbiMutation = useApiMutation<void, { id: number }>(
		variables => `/api/v1/abi/${variables.id}/delete`,
		'DELETE',
		{ defaultErrorMessage: 'Failed to delete ABI' }
	);

	// Convenience methods
	const addAbi = useCallback(
		async (name: string, description: string, abiContent: string) => {
			return addAbiMutation.mutate({
				name,
				description,
				abi_content: abiContent,
			});
		},
		[addAbiMutation]
	);

	const deleteAbi = useCallback(
		async (id: number) => {
			return deleteAbiMutation.mutate({ id });
		},
		[deleteAbiMutation]
	);

	// Legacy methods for backward compatibility
	const { abiList, isLoading, refetch: fetchAbiList } = useAbiList();

	const viewAbi = useCallback(async (id: number): Promise<ABIItem> => {
		const hook = useApiBase<ABIItem>(`/api/v1/abi/${id}`);
		await hook.refetch();
		if (hook.error) throw hook.error;
		return hook.data!;
	}, []);

	return {
		// Query hooks
		useAbiList,
		useAbiDetail,

		// Mutation methods
		addAbi,
		deleteAbi,

		// Legacy properties (for backward compatibility)
		abiList,
		isLoading,
		fetchAbiList,
		viewAbi,

		// Mutation states
		addAbiState: {
			data: addAbiMutation.data,
			error: addAbiMutation.error,
			isLoading: addAbiMutation.isLoading,
		},
		deleteAbiState: {
			data: deleteAbiMutation.data,
			error: deleteAbiMutation.error,
			isLoading: deleteAbiMutation.isLoading,
		},
	};
};
