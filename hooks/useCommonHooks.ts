/**
 * Common hook utilities and patterns
 * Provides reusable hook logic that can be shared across different components
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { 
  createToastNotification, 
  createDebouncedCallback, 
  useStableCallback 
} from './useHookUtils';
import type { VoidCallback, AsyncCallback, LoadingState } from '@/types';

/**
 * Hook for managing loading states with error handling
 * 
 * @returns Object containing loading state and control methods
 */
export function useLoadingState(initialLoading = false): LoadingState & {
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  reset: VoidCallback;
  withLoading: <T>(asyncFn: AsyncCallback<T>) => Promise<T>;
} {
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null); // Clear error when starting new operation
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const withLoading = useCallback(async <T>(asyncFn: AsyncCallback<T>): Promise<T> => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setLoading]);

  return {
    isLoading,
    error,
    setLoading,
    setError,
    reset,
    withLoading,
  };
}

/**
 * Hook for managing async operations with toast notifications
 * 
 * @param options Configuration for toast messages
 * @returns Object containing async operation handler
 */
export function useAsyncOperation(options: {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showToasts?: boolean;
} = {}) {
  const {
    loadingMessage = 'Processing...',
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    showToasts = true,
  } = options;

  const { isLoading, error, withLoading, reset } = useLoadingState();

  const execute = useCallback(async <T>(
    asyncFn: AsyncCallback<T>,
    customMessages?: {
      loading?: string;
      success?: string;
      error?: string;
    }
  ): Promise<T> => {
    const messages = {
      loading: customMessages?.loading || loadingMessage,
      success: customMessages?.success || successMessage,
      error: customMessages?.error || errorMessage,
    };

    let toastId: string | number | undefined;

    try {
      if (showToasts) {
        toastId = createToastNotification.loading(messages.loading);
      }

      const result = await withLoading(asyncFn);

      if (showToasts && toastId) {
        createToastNotification.success(messages.success, toastId);
      }

      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : messages.error;
      
      if (showToasts && toastId) {
        createToastNotification.error(errorMsg, toastId);
      }
      
      throw err;
    }
  }, [withLoading, loadingMessage, successMessage, errorMessage, showToasts]);

  return {
    execute,
    isLoading,
    error,
    reset,
  };
}

/**
 * Hook for managing local storage with type safety
 * 
 * @param key Storage key
 * @param defaultValue Default value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, VoidCallback] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for debouncing values
 * 
 * @param value Value to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for managing previous value
 * 
 * @param value Current value
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

/**
 * Hook for managing boolean toggle state
 * 
 * @param initialValue Initial boolean value
 * @returns Tuple of [value, toggle, setTrue, setFalse]
 */
export function useToggle(
  initialValue = false
): [boolean, VoidCallback, VoidCallback, VoidCallback] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}

/**
 * Hook for managing counter state
 * 
 * @param initialValue Initial counter value
 * @param step Step size for increment/decrement
 * @returns Object containing counter value and control methods
 */
export function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(prev => prev + step), [step]);
  const decrement = useCallback(() => setCount(prev => prev - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const set = useCallback((value: number) => setCount(value), []);

  return {
    count,
    increment,
    decrement,
    reset,
    set,
  };
}

/**
 * Hook for managing array state with common operations
 * 
 * @param initialArray Initial array value
 * @returns Object containing array and manipulation methods
 */
export function useArray<T>(initialArray: T[] = []) {
  const [array, setArray] = useState<T[]>(initialArray);

  const push = useCallback((element: T) => {
    setArray(prev => [...prev, element]);
  }, []);

  const filter = useCallback((callback: (item: T, index: number) => boolean) => {
    setArray(prev => prev.filter(callback));
  }, []);

  const update = useCallback((index: number, newElement: T) => {
    setArray(prev => prev.map((item, i) => i === index ? newElement : item));
  }, []);

  const remove = useCallback((index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const reset = useCallback(() => {
    setArray(initialArray);
  }, [initialArray]);

  return {
    array,
    set: setArray,
    push,
    filter,
    update,
    remove,
    clear,
    reset,
  };
}

/**
 * Hook for managing clipboard operations
 * 
 * @returns Object containing clipboard methods and state
 */
export function useClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      
      return true;
    } catch (error) {
      console.warn('Copy failed:', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  const paste = useCallback(async (): Promise<string | null> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return null;
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      console.warn('Paste failed:', error);
      return null;
    }
  }, []);

  return {
    copy,
    paste,
    copiedText,
    isCopied,
  };
}

/**
 * Hook for managing media queries
 * 
 * @param query Media query string
 * @returns Boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook for managing window size
 * 
 * @returns Object containing window dimensions
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook for managing document title
 * 
 * @param title Document title
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const previousTitle = document.title;
      document.title = title;

      return () => {
        document.title = previousTitle;
      };
    }
  }, [title]);
}

/**
 * Hook for managing interval
 * 
 * @param callback Callback function to execute
 * @param delay Delay in milliseconds (null to pause)
 */
export function useInterval(callback: VoidCallback, delay: number | null) {
  const savedCallback = useRef<VoidCallback | undefined>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => {
      savedCallback.current?.();
    };

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Hook for managing timeout
 * 
 * @param callback Callback function to execute
 * @param delay Delay in milliseconds
 */
export function useTimeout(callback: VoidCallback, delay: number) {
  const savedCallback = useRef<VoidCallback | undefined>(undefined);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current?.();
    };

    const id = setTimeout(tick, delay);
    return () => clearTimeout(id);
  }, [delay]);
}