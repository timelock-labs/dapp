'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase, useFilteredApi } from '@/hooks/useApiBase';
import { useApi } from './useApi';
import type {
  EmailNotification,
  EmailNotificationListResponse,
  EmailLog,
  CreateEmailNotificationRequest,
  UpdateEmailNotificationRequest,
  VerifyEmailRequest,
  ResendCodeRequest,
  EmergencyReplyRequest,
  EmailNotificationFilters,
} from '@/types';

// Re-export types for backward compatibility
export type { EmailNotification };

// Custom error class for API errors
export class ApiError extends Error {
  public code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * Hook for notification API operations with standardized patterns
 *
 * @returns Object containing notification API methods and hooks
 */
export const useNotificationApi = () => {
  const { request } = useApi();

  // Query hooks
  const useEmailNotifications = (filters: EmailNotificationFilters = {}) => {
    return useFilteredApi<EmailNotificationListResponse, EmailNotificationFilters>(
      '/api/v1/emails',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch email notifications' }
    );
  };

  const useEmailLogs = (filters: EmailNotificationFilters = {}) => {
    return useFilteredApi<EmailLog[], EmailNotificationFilters>(
      '/api/v1/emails/logs',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch email logs' }
    );
  };

  const useVerifiedEmails = () => {
    return useApiBase<EmailNotification[]>('/api/v1/emails/verified-emails', {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch verified emails',
    });
  };

  const useEmailNotificationByEmail = (email: string) => {
    return useApiBase<EmailNotification>(`/api/v1/emails/${encodeURIComponent(email)}`, {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch email notification details',
    });
  };

  // Mutations
  const createEmailNotificationMutation = useApiMutation<
    EmailNotification,
    CreateEmailNotificationRequest
  >('/api/v1/emails', 'POST', { defaultErrorMessage: 'Failed to create email notification' });

  const updateEmailNotificationMutation = useApiMutation<
    EmailNotification,
    {
      email: string;
      remark: string;
    }
  >(variables => `/api/v1/emails/${encodeURIComponent(variables.email)}/remark`, 'PUT', {
    defaultErrorMessage: 'Failed to update email notification',
  });

  const deleteEmailNotificationMutation = useApiMutation<string, { id: string }>(
    variables => `/api/v1/emails/${variables.id}`,
    'DELETE',
    { defaultErrorMessage: 'Failed to delete email notification' }
  );

  const verifyEmailMutation = useApiMutation<string, VerifyEmailRequest>(
    '/api/v1/emails/verify',
    'POST',
    { defaultErrorMessage: 'Failed to verify email' }
  );

  const sendVerificationCodeMutation = useApiMutation<string, ResendCodeRequest>(
    '/api/v1/emails/send-verification',
    'POST',
    { defaultErrorMessage: 'Failed to resend verification code' }
  );

  const handleEmergencyReplyMutation = useApiMutation<
    {
      message: string;
      replied_at: string;
      success: boolean;
    },
    EmergencyReplyRequest
  >('/api/v1/emails', 'POST', { defaultErrorMessage: 'Failed to handle emergency reply' });

  // Convenience methods
  const createEmailNotification = useCallback(
    async (data: CreateEmailNotificationRequest) => {
      const result = await createEmailNotificationMutation.mutate(data);
      if (createEmailNotificationMutation.error) {
        throw new ApiError(
          createEmailNotificationMutation.error.message,
          'CREATE_EMAIL_NOTIFICATION_FAILED'
        );
      }
      return result;
    },
    [createEmailNotificationMutation]
  );

  const updateEmailNotification = useCallback(
    async (email: string, remark: string) => {
      return updateEmailNotificationMutation.mutate({ email, remark });
    },
    [updateEmailNotificationMutation]
  );

  const deleteEmailNotification = useCallback(
    async (id: string) => {
      return deleteEmailNotificationMutation.mutate({ id });
    },
    [deleteEmailNotificationMutation]
  );

  const verifyEmail = useCallback(
    async (data: VerifyEmailRequest) => {
      return verifyEmailMutation.mutate(data);
    },
    [verifyEmailMutation]
  );

  const sendVerificationCode = useCallback(
    async (data: ResendCodeRequest) => {
      return sendVerificationCodeMutation.mutate(data);
    },
    [sendVerificationCodeMutation]
  );

  const handleEmergencyReply = useCallback(
    async (data: EmergencyReplyRequest) => {
      return handleEmergencyReplyMutation.mutate(data);
    },
    [handleEmergencyReplyMutation]
  );

  // Legacy methods for backward compatibility - using direct API calls
  const getEmailNotifications = useCallback(
    async (filters?: EmailNotificationFilters): Promise<EmailNotificationListResponse> => {
      try {
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, String(value));
            }
          });
        }

        const url = queryParams.toString()
          ? `/api/v1/emails?${queryParams.toString()}`
          : '/api/v1/emails';

        const response = await request(url, { method: 'GET' });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  const getEmailLogs = useCallback(
    async (filters?: EmailNotificationFilters): Promise<EmailLog[]> => {
      try {
        const queryParams = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, String(value));
            }
          });
        }

        const url = queryParams.toString()
          ? `/api/v1/emails/logs?${queryParams.toString()}`
          : '/api/v1/emails/logs';

        const response = await request(url, { method: 'GET' });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  const getVerifiedEmails = useCallback(async (): Promise<EmailNotification[]> => {
    try {
      const response = await request('/api/v1/emails/verified-emails', { method: 'GET' });
      return response.data;
    } catch (error) {
      throw error;
    }
  }, [request]);

  const getEmailNotificationByEmail = useCallback(
    async (email: string): Promise<EmailNotification> => {
      try {
        const response = await request(`/api/v1/emails/${encodeURIComponent(email)}`, {
          method: 'GET',
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    [request]
  );

  return {
    // Query hooks
    useEmailNotifications,
    useEmailLogs,
    useVerifiedEmails,
    useEmailNotificationByEmail,

    // Mutation methods
    createEmailNotification,
    updateEmailNotification,
    deleteEmailNotification,
    verifyEmail,
    sendVerificationCode,
    handleEmergencyReply,

    // Legacy methods (for backward compatibility)
    getEmailNotifications,
    getEmailLogs,
    getVerifiedEmails,
    getEmailNotificationByEmail,

    // Mutation states
    createEmailNotificationState: {
      data: createEmailNotificationMutation.data,
      error: createEmailNotificationMutation.error,
      isLoading: createEmailNotificationMutation.isLoading,
    },
    updateEmailNotificationState: {
      data: updateEmailNotificationMutation.data,
      error: updateEmailNotificationMutation.error,
      isLoading: updateEmailNotificationMutation.isLoading,
    },
    deleteEmailNotificationState: {
      data: deleteEmailNotificationMutation.data,
      error: deleteEmailNotificationMutation.error,
      isLoading: deleteEmailNotificationMutation.isLoading,
    },
  };
};
