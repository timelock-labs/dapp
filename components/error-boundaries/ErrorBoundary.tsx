/**
 * Comprehensive error boundary component
 * Provides error catching and recovery mechanisms for React components
 */

'use client';

// React imports
import React, { Component, ReactNode } from 'react';

// Internal components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Type imports
import type { ErrorInfo } from 'react';

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
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

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{
  error: Error;
  errorInfo: ErrorInfo;
  retry: () => void;
  showErrorDetails: boolean;
  errorMessage?: string;
  showRetry: boolean;
}> = ({ error, errorInfo, retry, showErrorDetails, errorMessage, showRetry }) => (
  <Card className="p-6 m-4 border-red-200 bg-red-50">
    <div className="text-center">
      <div className="text-red-600 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h2>
      
      <p className="text-gray-600 mb-4">
        {errorMessage ?? 'An unexpected error occurred. Please try again.'}
      </p>

      {showErrorDetails && (
        <details className="text-left mb-4 p-4 bg-white rounded border">
          <summary className="cursor-pointer font-medium text-red-700 mb-2">
            Error Details
          </summary>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <strong>Error:</strong> {error.message}
            </div>
            <div>
              <strong>Stack:</strong>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            </div>
            {errorInfo.componentStack && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </details>
      )}

      {showRetry && (
        <Button onClick={retry} variant="outline" className="mr-2">
          Try Again
        </Button>
      )}
      
      <Button
        onClick={() => window.location.reload()}
        variant="default"
      >
        Reload Page
      </Button>
    </div>
  </Card>
);

/**
 * Comprehensive error boundary component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component', componentName } = this.props;
    const errorId = this.state.errorId!;

    // Update state with error info
    this.setState({ errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary (${level}${componentName ? ` - ${componentName}` : ''})`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error ID:', errorId);
      console.groupEnd();
    }

    // Call custom error handler
    if (onError) {
      try {
        onError(error, errorInfo, errorId);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }

    // Report to error tracking service (if available)
    this.reportError(error, errorInfo, errorId);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // This would integrate with your error tracking service
    // For example: Sentry, LogRocket, Bugsnag, etc.
    
    const errorReport = {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level,
      componentName: this.props.componentName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to error tracking service
    // errorTrackingService.captureException(error, { extra: errorReport });
    
    // For now, just log to console in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Error Report:', errorReport);
    }
  };

  private handleRetry = () => {
    const { onRetry } = this.props;

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    // Call custom retry handler if provided
    if (onRetry) {
      try {
        onRetry();
      } catch (retryError) {
        console.error('Error in retry handler:', retryError);
      }
    }

    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  componentWillUnmount() {
    // Clear timeout on unmount
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    const {
      children,
      fallback,
      showErrorDetails = process.env.NODE_ENV === 'development',
      errorMessage,
      showRetry = true,
    } = this.props;

    const { hasError, error, errorInfo } = this.state;

    if (hasError && error && errorInfo) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleRetry);
      }

      // Use default fallback
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          retry={this.handleRetry}
          showErrorDetails={showErrorDetails}
          errorMessage={errorMessage}
          showRetry={showRetry}
        />
      );
    }

    return children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for manually triggering error boundary
 */
export function useErrorHandler() {
  return (error: Error, _errorInfo?: Partial<ErrorInfo>) => {
    // This will be caught by the nearest error boundary
    throw error;
  };
}