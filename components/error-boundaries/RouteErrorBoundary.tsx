/**
 * Route-level error boundary component
 * Specialized error boundary for handling page-level errors
 */

'use client';

// React imports
import React, { ReactNode } from 'react';

// Internal components
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';

// Type imports
import type { ErrorInfo } from 'react';

/**
 * Route error boundary props
 */
interface RouteErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Route name for context */
  routeName?: string;
  /** Custom error handler */
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  /** Custom retry handler */
  onRetry?: () => void;
}

/**
 * Route error fallback component
 */
const RouteErrorFallback: React.FC<{
  error: Error;
  errorInfo: ErrorInfo;
  retry: () => void;
  routeName?: string;
}> = ({ error, errorInfo, retry, routeName }) => {
  const isChunkError = error.message.includes('ChunkLoadError') ||
                      error.message.includes('Loading chunk') ||
                      error.message.includes('Loading CSS chunk');

  const is404Error = error.message.includes('404') ||
                    error.message.includes('Not Found');

  const getErrorContent = () => {
    if (isChunkError) {
      return {
        title: 'Update Required',
        message: 'The application has been updated. Please refresh the page to get the latest version.',
        icon: (
          <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        ),
        primaryAction: 'Refresh Page',
        primaryHandler: () => window.location.reload(),
      };
    }

    if (is404Error) {
      return {
        title: 'Page Not Found',
        message: `The ${routeName ? `${routeName} page` : 'requested page'} could not be found.`,
        icon: (
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        primaryAction: 'Go Home',
        primaryHandler: () => window.location.href = '/',
      };
    }

    return {
      title: 'Something Went Wrong',
      message: `An error occurred while loading ${routeName ? `the ${routeName} page` : 'this page'}. Please try again.`,
      icon: (
        <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      primaryAction: 'Try Again',
      primaryHandler: retry,
    };
  };

  const { title, message, icon, primaryAction, primaryHandler } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          {icon}
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={primaryHandler}
            className="w-full"
            size="lg"
          >
            {primaryAction}
          </Button>

          {!isChunkError && !is404Error && (
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              Go Home
            </Button>
          )}

          {process.env.NODE_ENV === 'development' && (
            <details className="text-left mt-6 p-4 bg-white rounded border">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Developer Information
              </summary>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <strong>Route:</strong> {routeName ?? 'Unknown'}
                </div>
                <div>
                  <strong>Error:</strong> {error.message}
                </div>
                <div>
                  <strong>Stack:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
                {errorInfo.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Route error boundary component
 */
export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children,
  routeName,
  onError,
  onRetry,
}) => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, retry) => (
        <RouteErrorFallback
          error={error}
          errorInfo={errorInfo}
          retry={retry}
          routeName={routeName}
        />
      )}
      onError={onError}
      onRetry={onRetry}
      level="page"
      componentName={routeName}
    >
      {children}
    </ErrorBoundary>
  );
};