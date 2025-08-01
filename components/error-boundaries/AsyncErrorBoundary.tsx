/**
 * Async error boundary component
 * Specialized error boundary for handling async operation errors
 */

'use client';

// React imports
import React, { ReactNode } from 'react';

// Internal components
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Type imports
import type { ErrorInfo } from 'react';

/**
 * Async error boundary props
 */
interface AsyncErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  /** Custom retry handler */
  onRetry?: () => void;
  /** Loading component name for context */
  operationName?: string;
  /** Whether to show detailed error information */
  showDetails?: boolean;
}

/**
 * Async operation error fallback component
 */
const AsyncErrorFallback: React.FC<{
  error: Error;
  errorInfo: ErrorInfo;
  retry: () => void;
  operationName?: string;
  showDetails: boolean;
}> = ({ error, retry, operationName, showDetails }) => {
  const isNetworkError = error.message.toLowerCase().includes('network') ||
                        error.message.toLowerCase().includes('fetch') ||
                        error.message.toLowerCase().includes('timeout');

  const isAuthError = error.message.toLowerCase().includes('unauthorized') ||
                     error.message.toLowerCase().includes('authentication') ||
                     error.message.toLowerCase().includes('token');

  const getErrorIcon = () => {
    if (isNetworkError) {
      return (
        <svg className="mx-auto h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }

    if (isAuthError) {
      return (
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }

    return (
      <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    );
  };

  const getErrorTitle = () => {
    if (isNetworkError) {
      return 'Connection Problem';
    }

    if (isAuthError) {
      return 'Authentication Required';
    }

    return operationName ? `${operationName} Failed` : 'Operation Failed';
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    if (isAuthError) {
      return 'Your session has expired. Please log in again to continue.';
    }

    return `The ${operationName?.toLowerCase() ?? 'operation'} could not be completed. Please try again.`;
  };

  const getActionButtons = () => {
    if (isAuthError) {
      return (
        <div className="space-x-2">
          <Button
            onClick={() => window.location.href = '/login'}
            variant="default"
          >
            Log In
          </Button>
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    return (
      <div className="space-x-2">
        <Button onClick={retry} variant="default">
          Try Again
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Reload Page
        </Button>
      </div>
    );
  };

  return (
    <Card className="p-8 m-4 text-center">
      <div className="mb-4">
        {getErrorIcon()}
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {getErrorMessage()}
      </p>

      {showDetails && (
        <details className="text-left mb-6 p-4 bg-gray-50 rounded border max-w-2xl mx-auto">
          <summary className="cursor-pointer font-medium text-gray-700 mb-2">
            Technical Details
          </summary>
          <div className="text-sm text-gray-600 space-y-2">
            <div>
              <strong>Error:</strong> {error.message}
            </div>
            {error.stack && (
              <div>
                <strong>Stack Trace:</strong>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                  {error.stack}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}

      {getActionButtons()}
    </Card>
  );
};

/**
 * Async error boundary component
 */
export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  onError,
  onRetry,
  operationName,
  showDetails = process.env.NODE_ENV === 'development',
}) => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, retry) => (
        <AsyncErrorFallback
          error={error}
          errorInfo={errorInfo}
          retry={retry}
          operationName={operationName}
          showDetails={showDetails}
        />
      )}
      onError={onError}
      onRetry={onRetry}
      level="section"
      componentName={operationName}
    >
      {children}
    </ErrorBoundary>
  );
};