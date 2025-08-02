/**
 * Default error fallback component
 */

'use client';

import React from 'react';
import type { ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DefaultErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  retry: () => void;
  showErrorDetails: boolean;
  errorMessage?: string;
  showRetry: boolean;
}

export const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  retry, 
  showErrorDetails, 
  errorMessage, 
  showRetry 
}) => (
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