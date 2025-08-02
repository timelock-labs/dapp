/**
 * Error boundary types
 */

import type { ReactNode, ErrorInfo } from 'react';

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Fallback component to render on error */
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  /** Whether to show error details in development */
  showErrorDetails?: boolean;
  /** Custom error message */
  errorMessage?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Custom retry handler */
  onRetry?: () => void;
  /** Error boundary level (for logging) */
  level?: 'page' | 'section' | 'component';
  /** Component name (for logging) */
  componentName?: string;
}