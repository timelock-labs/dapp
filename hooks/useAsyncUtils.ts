/**
 * Standardized async operation utilities
 * Provides consistent patterns for async operations with proper error handling and cleanup
 */

'use client';

// React imports
import { useCallback, useRef, useEffect } from 'react';

// Internal hooks
import { createErrorMessage } from './useHookUtils';

// Type imports
import type { AsyncCallback, VoidCallback } from '@/types';

/**
 * Configuration for async operations
 */
interface AsyncOperationConfig {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Number of retry attempts */
  retries?: number;
  /** Delay between retries in milliseconds */
  retryDelay?: number;
  /** Whether to abort on component unmount */
  abortOnUnmount?: boolean;
  /** Custom error handler */
  onError?: (error: Error) => void;
  /** Custom success handler */
  onSuccess?: (result: any) => void;
}

/**
 * Result of an async operation
 */
interface AsyncOperationResult<T> {
  /** The result data */
  data: T | null;
  /** Any error that occurred */
  error: Error | null;
  /** Whether the operation is currently running */
  isLoading: boolean;
  /** Whether the operation completed successfully */
  isSuccess: boolean;
  /** Whether an error occurred */
  isError: boolean;
  /** Whether the operation was aborted */
  isAborted: boolean;
}

/**
 * Hook for standardized async operations with comprehensive error handling
 *
 * @param config Configuration for the async operation
 * @returns Object containing async operation utilities
 */
export function useStandardizedAsync<T = unknown>(config: AsyncOperationConfig = {}) {
  const {
    timeout = 30000,
    retries = 0,
    retryDelay = 1000,
    abortOnUnmount = true,
    onError,
    onSuccess,
  } = config;

  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Create a new abort controller
   */
  const createAbortController = useCallback(() => {
    // Abort previous operation if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  /**
   * Execute async operation with timeout
   */
  const withTimeout = useCallback(
    <R>(promise: Promise<R>, timeoutMs = timeout): Promise<R> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeoutMs}ms`));
        }, timeoutMs);

        promise
          .then(resolve)
          .catch(reject)
          .finally(() => {
            clearTimeout(timeoutId);
          });
      });
    },
    [timeout]
  );

  /**
   * Execute async operation with retry logic
   */
  const withRetry = useCallback(
    async <R>(asyncFn: AsyncCallback<R>, maxRetries = retries): Promise<R> => {
      let lastError: Error;
      let attempt = 0;

      while (attempt <= maxRetries) {
        try {
          return await asyncFn();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (attempt < maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
          }

          attempt++;
        }
      }

      throw lastError!;
    },
    [retries, retryDelay]
  );

  /**
   * Execute async operation with comprehensive error handling
   */
  const execute = useCallback(
    async <R>(asyncFn: AsyncCallback<R>): Promise<AsyncOperationResult<R>> => {
      const controller = createAbortController();
      const signal = controller.signal;

      const result: AsyncOperationResult<R> = {
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
        isAborted: false,
      };

      try {
        // Check if already aborted
        if (signal.aborted) {
          throw new Error('Operation was aborted');
        }

        // Execute with timeout and retry logic
        const data = await withTimeout(
          withRetry(async () => {
            // Check abort signal before execution
            if (signal.aborted) {
              throw new Error('Operation was aborted');
            }
            return await asyncFn();
          })
        );

        // Check if aborted after completion
        if (signal.aborted) {
          throw new Error('Operation was aborted');
        }

        result.data = data;
        result.isSuccess = true;
        result.isLoading = false;

        // Call success handler
        if (onSuccess) {
          onSuccess(data);
        }

        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));

        result.error = errorObj;
        result.isError = true;
        result.isLoading = false;
        result.isAborted = errorObj.message.includes('aborted');

        // Call error handler
        if (onError && !result.isAborted) {
          onError(errorObj);
        }

        return result;
      }
    },
    [createAbortController, withTimeout, withRetry, onError, onSuccess]
  );

  /**
   * Execute async operation and return data directly (throws on error)
   */
  const executeAndUnwrap = useCallback(
    async <R>(asyncFn: AsyncCallback<R>): Promise<R> => {
      const result = await execute(asyncFn);

      if (result.isError && result.error) {
        throw result.error;
      }

      if (result.data === null) {
        throw new Error('Operation completed but returned no data');
      }

      return result.data;
    },
    [execute]
  );

  /**
   * Abort current operation
   */
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Check if operation is currently running
   */
  const isRunning = useCallback(() => {
    return abortControllerRef.current !== null;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    if (abortOnUnmount) {
      return () => {
        abort();
      };
    }
    return undefined;
  }, [abort, abortOnUnmount]);

  return {
    execute,
    executeAndUnwrap,
    withTimeout,
    withRetry,
    abort,
    isRunning,
  };
}

/**
 * Hook for managing multiple concurrent async operations
 *
 * @param config Configuration for async operations
 * @returns Object containing concurrent operation utilities
 */
export function useConcurrentAsync(config: AsyncOperationConfig = {}) {
  const operationsRef = useRef<Map<string, AbortController>>(new Map());

  /**
   * Execute multiple async operations concurrently
   */
  const executeAll = useCallback(
    async <T>(operations: Record<string, AsyncCallback<T>>): Promise<Record<string, T>> => {
      const results: Record<string, T> = {};
      const promises: Promise<void>[] = [];

      for (const [key, asyncFn] of Object.entries(operations)) {
        const controller = new AbortController();
        operationsRef.current.set(key, controller);

        const promise = asyncFn()
          .then(result => {
            results[key] = result;
          })
          .catch(error => {
            throw new Error(`Operation '${key}' failed: ${createErrorMessage(error)}`);
          })
          .finally(() => {
            operationsRef.current.delete(key);
          });

        promises.push(promise);
      }

      try {
        await Promise.all(promises);
        return results;
      } catch (error) {
        // Abort all remaining operations
        for (const controller of operationsRef.current.values()) {
          controller.abort();
        }
        operationsRef.current.clear();
        throw error;
      }
    },
    []
  );

  /**
   * Execute async operations in sequence
   */
  const executeSequentially = useCallback(
    async <T>(operations: AsyncCallback<T>[]): Promise<T[]> => {
      const results: T[] = [];

      for (let i = 0; i < operations.length; i++) {
        const controller = new AbortController();
        operationsRef.current.set(`seq-${i}`, controller);

        try {
          const operation = operations[i];
          if (!operation) {
            throw new Error(`Operation at index ${i} is undefined`);
          }
          const result = await operation();
          results.push(result);
        } catch (error) {
          // Abort remaining operations
          for (const [key, ctrl] of operationsRef.current.entries()) {
            if (key.startsWith('seq-')) {
              const indexStr = key.split('-')[1];
              if (indexStr && parseInt(indexStr) > i) {
                ctrl.abort();
              }
            }
          }
          throw error;
        } finally {
          operationsRef.current.delete(`seq-${i}`);
        }
      }

      return results;
    },
    []
  );

  /**
   * Abort all operations
   */
  const abortAll = useCallback(() => {
    for (const controller of operationsRef.current.values()) {
      controller.abort();
    }
    operationsRef.current.clear();
  }, []);

  /**
   * Abort specific operation
   */
  const abortOperation = useCallback((key: string) => {
    const controller = operationsRef.current.get(key);
    if (controller) {
      controller.abort();
      operationsRef.current.delete(key);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortAll();
    };
  }, [abortAll]);

  return {
    executeAll,
    executeSequentially,
    abortAll,
    abortOperation,
    getRunningOperations: () => Array.from(operationsRef.current.keys()),
  };
}

/**
 * Hook for debounced async operations
 *
 * @param asyncFn The async function to debounce
 * @param delay Debounce delay in milliseconds
 * @param config Additional configuration
 * @returns Debounced async function
 */
export function useDebouncedAsync<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  delay: number,
  config: AsyncOperationConfig = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { execute } = useStandardizedAsync<R>(config);

  const debouncedFn = useCallback(
    (...args: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        // Clear previous timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(async () => {
          try {
            const result = await execute(() => asyncFn(...args));
            if (result.isSuccess && result.data !== null) {
              resolve(result.data);
            } else if (result.error) {
              reject(result.error);
            } else {
              reject(new Error('Operation failed with no error details'));
            }
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    },
    [asyncFn, delay, execute]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}
