/**
 * Base API hook utilities and patterns
 * Provides common functionality for all API hooks
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuthStore } from '@/store/userStore';
import type { ApiRequestOptions, HttpMethod, AsyncResult, PaginationParams, FilterParams } from '@/types';

/**
 * Configuration for API hook behavior
 */
export interface ApiHookConfig extends Partial<ApiRequestOptions> {
	/** Whether to automatically fetch data on mount */
	autoFetch?: boolean;
	/** Whether to refetch when dependencies change */
	refetchOnDepsChange?: boolean;
	/** Default error message */
	defaultErrorMessage?: string;
	/** Whether to include auth headers by default */
	requiresAuth?: boolean;
}

/**
 * Base API hook return type
 */
export interface UseApiBaseReturn<T> extends AsyncResult<T> {
	/** Manually trigger a refetch */
	refetch: () => Promise<void>;
	/** Reset the hook state */
	reset: () => void;
	/** Whether the hook has been initialized */
	isInitialized: boolean;
}

/**
 * Hook for making authenticated API requests with consistent patterns
 */
export function useApiBase<T = unknown>(endpoint: string, options: ApiHookConfig = {}): UseApiBaseReturn<T> {
	const { request } = useApi();
	const accessToken = useAuthStore(state => state.accessToken);

	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const hasFetched = useRef(false);
	const abortController = useRef<AbortController | null>(null);

	const { autoFetch = false, requiresAuth = true, defaultErrorMessage = 'Request failed', ...requestOptions } = options;

	/**
	 * Create headers with authentication if required
	 */
	const createHeaders = useCallback(() => {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...requestOptions.headers,
		};

		if (requiresAuth && accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`;
		}

		return headers;
	}, [accessToken, requiresAuth, requestOptions.headers]);

	/**
	 * Execute the API request
	 */
	const executeRequest = useCallback(async (): Promise<void> => {
		if (requiresAuth && !accessToken) {
			setError(new Error('Authentication required'));
			return;
		}

		// Cancel previous request if still pending
		abortController.current?.abort();

		abortController.current = new AbortController();
		setIsLoading(true);
		setError(null);

		try {
			const response = await request(endpoint, {
				...requestOptions,
				headers: createHeaders(),
			});

			if (response?.success) {
				setData(response.data);
			} else {
				throw new Error(response?.error?.message ?? defaultErrorMessage);
			}
		} catch (err) {
			if (err instanceof Error && err.name !== 'AbortError') {
				setError(err);
				console.error(`API request failed for ${endpoint}:`, err);
			}
		} finally {
			setIsLoading(false);
			setIsInitialized(true);
			abortController.current = null;
		}
	}, [endpoint, request, createHeaders, requestOptions, requiresAuth, accessToken, defaultErrorMessage]);

	/**
	 * Refetch data manually
	 */
	const refetch = useCallback(async (): Promise<void> => {
		hasFetched.current = false;
		await executeRequest();
	}, [executeRequest]);

	/**
	 * Reset hook state
	 */
	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
		setIsInitialized(false);
		hasFetched.current = false;

		if (abortController.current) {
			abortController.current.abort();
			abortController.current = null;
		}
	}, []);

	// Auto-fetch on mount if enabled
	useEffect(() => {
		if (autoFetch && !hasFetched.current && (!requiresAuth || accessToken)) {
			hasFetched.current = true;
			executeRequest();
		}
	}, [autoFetch, executeRequest, requiresAuth, accessToken]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			abortController.current?.abort();
		};
	}, []);

	return {
		data,
		error,
		isLoading,
		isInitialized,
		refetch,
		reset,
	};
}

/**
 * Paginated API response type
 */
interface PaginatedApiResponse<T> {
	items: T[];
	page: number;
	page_size: number;
	total: number;
	total_pages: number;
}

/**
 * Hook for making paginated API requests
 */
export function usePaginatedApi<T = unknown>(endpoint: string, initialParams: PaginationParams = { page: 1, page_size: 10 }, options: ApiHookConfig = {}) {
	const [params, setParams] = useState<PaginationParams>(initialParams);
	const [allData, setAllData] = useState<T[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [hasMore, setHasMore] = useState(true);

	const buildUrl = useCallback(() => {
		const searchParams = new URLSearchParams();
		searchParams.append('page', params.page.toString());
		searchParams.append('page_size', params.page_size.toString());
		return `${endpoint}?${searchParams.toString()}`;
	}, [endpoint, params]);

	const {
		data,
		error,
		isLoading,
		refetch: baseRefetch,
		reset: baseReset,
		isInitialized,
	} = useApiBase<PaginatedApiResponse<T>>(buildUrl(), {
		...options,
		autoFetch: true,
	});

	// Update pagination state when data changes
	useEffect(() => {
		if (data) {
			if (params.page === 1) {
				setAllData(data.items ?? []);
			} else {
				setAllData(prev => [...prev, ...(data.items ?? [])]);
			}

			setTotalCount(data.total ?? 0);
			setHasMore((data.page ?? 0) < (data.total_pages ?? 0));
		}
	}, [data, params.page]);

	const loadMore = useCallback(async () => {
		if (!hasMore || isLoading) return;

		setParams(prev => ({ ...prev, page: prev.page + 1 }));
	}, [hasMore, isLoading]);

	const refresh = useCallback(async () => {
		setParams(prev => ({ ...prev, page: 1 }));
		setAllData([]);
		await baseRefetch();
	}, [baseRefetch]);

	const reset = useCallback(() => {
		setParams(initialParams);
		setAllData([]);
		setTotalCount(0);
		setHasMore(true);
		baseReset();
	}, [initialParams, baseReset]);

	return {
		data: allData,
		error,
		isLoading,
		isInitialized,
		totalCount,
		hasMore,
		currentPage: params.page,
		pageSize: params.page_size,
		loadMore,
		refresh,
		reset,
		setPageSize: (size: number) => setParams(prev => ({ ...prev, page_size: size, page: 1 })),
	};
}

/**
 * Hook for making filtered API requests
 */
export function useFilteredApi<T = unknown, F extends FilterParams = FilterParams>(endpoint: string, initialFilters: F, options: ApiHookConfig = {}) {
	const [filters, setFilters] = useState<F>(initialFilters);

	const buildUrl = useCallback(() => {
		const searchParams = new URLSearchParams();

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				searchParams.append(key, String(value));
			}
		});

		const queryString = searchParams.toString();
		return queryString ? `${endpoint}?${queryString}` : endpoint;
	}, [endpoint, filters]);

	const {
		data,
		error,
		isLoading,
		refetch,
		reset: baseReset,
		isInitialized,
	} = useApiBase<T>(buildUrl(), {
		...options,
		autoFetch: true,
	});

	const updateFilters = useCallback((newFilters: Partial<F>) => {
		setFilters(prev => ({ ...prev, ...newFilters }));
	}, []);

	const resetFilters = useCallback(() => {
		setFilters(initialFilters);
	}, [initialFilters]);

	const reset = useCallback(() => {
		resetFilters();
		baseReset();
	}, [resetFilters, baseReset]);

	return {
		data,
		error,
		isLoading,
		isInitialized,
		filters,
		updateFilters,
		resetFilters,
		refetch,
		reset,
	};
}

/**
 * Hook for making mutation requests (POST, PUT, DELETE)
 */
export function useApiMutation<TData = unknown, TVariables = unknown>(
	endpoint: string | ((variables: TVariables) => string),
	method: HttpMethod = 'POST',
	options: ApiHookConfig = {}
) {
	const { request } = useApi();
	const accessToken = useAuthStore(state => state.accessToken);

	const [data, setData] = useState<TData | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const { requiresAuth = true, defaultErrorMessage = 'Mutation failed', ...requestOptions } = options;

	const createHeaders = useCallback(() => {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			...requestOptions.headers,
		};

		if (requiresAuth && accessToken) {
			headers['Authorization'] = `Bearer ${accessToken}`;
		}

		return headers;
	}, [accessToken, requiresAuth, requestOptions.headers]);

	const mutate = useCallback(
		async (variables?: TVariables): Promise<TData> => {
			if (requiresAuth && !accessToken) {
				throw new Error('Authentication required');
			}

			setIsLoading(true);
			setError(null);

			try {
				const url = typeof endpoint === 'function' ? endpoint(variables as TVariables) : endpoint;

				const response = await request(url, {
					method,
					headers: createHeaders(),
					body: variables,
					...requestOptions,
				});

				if (response?.success) {
					setData(response.data);
					return response.data;
				} else {
					throw new Error(response?.error?.message ?? defaultErrorMessage);
				}
			} catch (err) {
				const error = err instanceof Error ? err : new Error(defaultErrorMessage);
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[endpoint, method, request, createHeaders, requiresAuth, accessToken, defaultErrorMessage, requestOptions]
	);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
		setIsLoading(false);
	}, []);

	return {
		data,
		error,
		isLoading,
		mutate,
		reset,
	};
}
