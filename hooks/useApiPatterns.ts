/**
 * Common API patterns and utilities
 * Provides reusable patterns for API operations across different domains
 */

'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase, useFilteredApi } from './useApiBase';
import { createApiEndpoint, createDynamicEndpoint, formatApiError } from './useHookUtils';
import type { 
  HttpMethod,
  FilterParams,
  PaginationParams
} from '@/types';

/**
 * Configuration for CRUD operations
 */
export interface CrudConfig<TEntity, TCreateRequest, TUpdateRequest> {
  baseEndpoint: string;
  entityName: string;
  defaultErrorMessages?: {
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
    list?: string;
  };
}

/**
 * Hook for standard CRUD operations
 * Provides create, read, update, delete, and list operations for any entity
 */
export function useCrudOperations<
  TEntity,
  TCreateRequest,
  TUpdateRequest,
  TFilters extends FilterParams = FilterParams
>(config: CrudConfig<TEntity, TCreateRequest, TUpdateRequest>) {
  const {
    baseEndpoint,
    entityName,
    defaultErrorMessages = {}
  } = config;

  // Mutations
  const createMutation = useApiMutation<TEntity, TCreateRequest>(
    baseEndpoint,
    'POST',
    { 
      defaultErrorMessage: defaultErrorMessages.create || `Failed to create ${entityName}` 
    }
  );

  const updateMutation = useApiMutation<TEntity, { id: string | number; data: TUpdateRequest }>(
    (variables) => `${baseEndpoint}/${variables.id}`,
    'PUT',
    { 
      defaultErrorMessage: defaultErrorMessages.update || `Failed to update ${entityName}` 
    }
  );

  const deleteMutation = useApiMutation<void, { id: string | number }>(
    (variables) => `${baseEndpoint}/${variables.id}`,
    'DELETE',
    { 
      defaultErrorMessage: defaultErrorMessages.delete || `Failed to delete ${entityName}` 
    }
  );

  // Query hooks
  const useEntityList = (filters: TFilters = {} as TFilters) => {
    return useFilteredApi<TEntity[], TFilters>(
      baseEndpoint,
      filters,
      { 
        autoFetch: true, 
        defaultErrorMessage: defaultErrorMessages.list || `Failed to fetch ${entityName} list` 
      }
    );
  };

  const useEntityById = (id: string | number) => {
    return useApiBase<TEntity>(`${baseEndpoint}/${id}`, {
      autoFetch: true,
      defaultErrorMessage: defaultErrorMessages.read || `Failed to fetch ${entityName} details`
    });
  };

  // Convenience methods
  const create = useCallback(async (data: TCreateRequest) => {
    return createMutation.mutate(data);
  }, [createMutation]);

  const update = useCallback(async (id: string | number, data: TUpdateRequest) => {
    return updateMutation.mutate({ id, data });
  }, [updateMutation]);

  const remove = useCallback(async (id: string | number) => {
    return deleteMutation.mutate({ id });
  }, [deleteMutation]);

  return {
    // Query hooks
    useEntityList,
    useEntityById,
    
    // Mutation methods
    create,
    update,
    remove,
    
    // Mutation states
    createState: {
      data: createMutation.data,
      error: createMutation.error,
      isLoading: createMutation.isLoading,
    },
    updateState: {
      data: updateMutation.data,
      error: updateMutation.error,
      isLoading: updateMutation.isLoading,
    },
    deleteState: {
      data: deleteMutation.data,
      error: deleteMutation.error,
      isLoading: deleteMutation.isLoading,
    },
  };
}

/**
 * Hook for paginated list operations
 * Provides standardized pagination patterns
 */
export function usePaginatedList<TEntity, TFilters extends FilterParams = FilterParams>(
  endpoint: string,
  initialFilters: TFilters & PaginationParams = { page: 1, page_size: 10 } as TFilters & PaginationParams,
  entityName = 'items'
) {
  const {
    data,
    error,
    isLoading,
    isInitialized,
    filters,
    updateFilters,
    resetFilters,
    refetch,
    reset
  } = useFilteredApi<{
    items: TEntity[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  }, TFilters & PaginationParams>(
    endpoint,
    initialFilters,
    { 
      autoFetch: true, 
      defaultErrorMessage: `Failed to fetch ${entityName}` 
    }
  );

  const goToPage = useCallback((page: number) => {
    updateFilters({ page } as Partial<TFilters & PaginationParams>);
  }, [updateFilters]);

  const changePageSize = useCallback((pageSize: number) => {
    updateFilters({ 
      page: 1, 
      page_size: pageSize 
    } as Partial<TFilters & PaginationParams>);
  }, [updateFilters]);

  const applyFilters = useCallback((newFilters: Partial<TFilters>) => {
    updateFilters({ 
      ...newFilters, 
      page: 1 
    } as Partial<TFilters & PaginationParams>);
  }, [updateFilters]);

  return {
    // Data
    items: data?.items || [],
    total: data?.total || 0,
    currentPage: data?.page || 1,
    pageSize: data?.page_size || 10,
    totalPages: data?.total_pages || 0,
    
    // State
    error,
    isLoading,
    isInitialized,
    isEmpty: isInitialized && !isLoading && !error && (!data?.items || data.items.length === 0),
    
    // Filters
    filters,
    applyFilters,
    resetFilters,
    
    // Pagination
    goToPage,
    changePageSize,
    hasNextPage: (data?.page || 0) < (data?.total_pages || 0),
    hasPreviousPage: (data?.page || 0) > 1,
    
    // Actions
    refetch,
    reset,
  };
}

/**
 * Hook for batch operations
 * Provides utilities for performing operations on multiple items
 */
export function useBatchOperations<TEntity, TBatchRequest>(
  endpoint: string,
  entityName = 'items'
) {
  const batchUpdateMutation = useApiMutation<TEntity[], TBatchRequest>(
    `${endpoint}/batch`,
    'PUT',
    { defaultErrorMessage: `Failed to batch update ${entityName}` }
  );

  const batchDeleteMutation = useApiMutation<void, { ids: (string | number)[] }>(
    `${endpoint}/batch`,
    'DELETE',
    { defaultErrorMessage: `Failed to batch delete ${entityName}` }
  );

  const batchUpdate = useCallback(async (data: TBatchRequest) => {
    return batchUpdateMutation.mutate(data);
  }, [batchUpdateMutation]);

  const batchDelete = useCallback(async (ids: (string | number)[]) => {
    return batchDeleteMutation.mutate({ ids });
  }, [batchDeleteMutation]);

  return {
    batchUpdate,
    batchDelete,
    batchUpdateState: {
      data: batchUpdateMutation.data,
      error: batchUpdateMutation.error,
      isLoading: batchUpdateMutation.isLoading,
    },
    batchDeleteState: {
      data: batchDeleteMutation.data,
      error: batchDeleteMutation.error,
      isLoading: batchDeleteMutation.isLoading,
    },
  };
}

/**
 * Hook for search operations
 * Provides standardized search patterns with debouncing
 */
export function useSearch<TEntity>(
  endpoint: string,
  debounceMs = 300,
  entityName = 'items'
) {
  const searchMutation = useApiMutation<TEntity[], { query: string; filters?: Record<string, unknown> }>(
    endpoint,
    'POST',
    { defaultErrorMessage: `Failed to search ${entityName}` }
  );

  const search = useCallback(async (query: string, filters?: Record<string, unknown>) => {
    if (!query.trim()) {
      return [];
    }
    return searchMutation.mutate({ query, filters });
  }, [searchMutation]);

  return {
    search,
    results: searchMutation.data || [],
    isSearching: searchMutation.isLoading,
    searchError: searchMutation.error,
    clearResults: searchMutation.reset,
  };
}

/**
 * Hook for file upload operations
 * Provides standardized file upload patterns
 */
export function useFileUpload(
  endpoint: string,
  options: {
    maxFileSize?: number;
    allowedTypes?: string[];
    multiple?: boolean;
  } = {}
) {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = [],
    multiple = false
  } = options;

  const uploadMutation = useApiMutation<{ url: string; filename: string }[], FormData>(
    endpoint,
    'POST',
    { 
      defaultErrorMessage: 'Failed to upload file(s)',
      headers: {} // Don't set Content-Type for FormData
    }
  );

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`;
    }

    return null;
  }, [maxFileSize, allowedTypes]);

  const upload = useCallback(async (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];

    if (!multiple && fileArray.length > 1) {
      throw new Error('Multiple files not allowed');
    }

    // Validate all files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        throw new Error(error);
      }
    }

    // Create FormData
    const formData = new FormData();
    fileArray.forEach((file, index) => {
      formData.append(multiple ? `files[${index}]` : 'file', file);
    });

    return uploadMutation.mutate(formData);
  }, [multiple, validateFile, uploadMutation]);

  return {
    upload,
    validateFile,
    uploadedFiles: uploadMutation.data || [],
    isUploading: uploadMutation.isLoading,
    uploadError: uploadMutation.error,
    reset: uploadMutation.reset,
  };
}

/**
 * Hook for export operations
 * Provides standardized data export patterns
 */
export function useDataExport(
  endpoint: string,
  entityName = 'data'
) {
  const exportMutation = useApiMutation<{ downloadUrl: string; filename: string }, {
    format: 'csv' | 'xlsx' | 'json';
    filters?: Record<string, unknown>;
  }>(
    endpoint,
    'POST',
    { defaultErrorMessage: `Failed to export ${entityName}` }
  );

  const exportData = useCallback(async (
    format: 'csv' | 'xlsx' | 'json',
    filters?: Record<string, unknown>
  ) => {
    const result = await exportMutation.mutate({ format, filters });
    
    // Automatically trigger download
    if (result?.downloadUrl) {
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    return result;
  }, [exportMutation]);

  return {
    exportData,
    isExporting: exportMutation.isLoading,
    exportError: exportMutation.error,
    lastExport: exportMutation.data,
  };
}