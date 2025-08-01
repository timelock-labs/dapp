'use client';

import { useCallback } from 'react';
import { useApiMutation, useApiBase, useFilteredApi } from '@/hooks/useApiBase';
import type {
  EmailNotification,
  EmailNotificationListResponse,
  EmailLog,
  CreateEmailNotificationRequest,
  UpdateEmailNotificationRequest,
  VerifyEmailRequest,
  ResendCodeRequest,
  EmergencyReplyRequest,
  EmailNotificationFilters
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

  // Query hooks
  const useEmailNotifications = (filters: EmailNotificationFilters = {}) => {
    return useFilteredApi<EmailNotificationListResponse, EmailNotificationFilters>(
      '/api/v1/email-notifications',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch email notifications' }
    );
  };

  const useEmailLogs = (filters: EmailNotificationFilters = {}) => {
    return useFilteredApi<EmailLog[], EmailNotificationFilters>(
      '/api/v1/email-notifications/logs',
      { page: 1, page_size: 10, ...filters },
      { autoFetch: true, defaultErrorMessage: 'Failed to fetch email logs' }
    );
  };

  const useVerifiedEmails = () => {
    return useApiBase<EmailNotification[]>('/api/v1/email-notifications/verified-emails', {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch verified emails'
    });
  };

  const useEmailNotificationByEmail = (email: string) => {
    return useApiBase<EmailNotification>(`/api/v1/email-notifications/${encodeURIComponent(email)}`, {
      autoFetch: true,
      defaultErrorMessage: 'Failed to fetch email notification details'
    });
  };

  // Mutations
  const createEmailNotificationMutation = useApiMutation<EmailNotification, CreateEmailNotificationRequest>(
    '/api/v1/email-notifications',
    'POST',
    { defaultErrorMessage: 'Failed to create email notification' }
  );

  const updateEmailNotificationMutation = useApiMutation<EmailNotification, {
    email: string;
    data: UpdateEmailNotificationRequest;
  }>(
    (variables) => `/api/v1/email-notifications/${encodeURIComponent(variables.email)}`,
    'PUT',
    { defaultErrorMessage: 'Failed to update email notification' }
  );

  const deleteEmailNotificationMutation = useApiMutation<string, { email: string }>(
    (variables) => `/api/v1/email-notifications/${encodeURIComponent(variables.email)}`,
    'DELETE',
    { defaultErrorMessage: 'Failed to delete email notification' }
  );

  const verifyEmailMutation = useApiMutation<string, VerifyEmailRequest>(
    '/api/v1/email-notifications/verify',
    'POST',
    { defaultErrorMessage: 'Failed to verify email' }
  );

  const resendVerificationCodeMutation = useApiMutation<string, ResendCodeRequest>(
    '/api/v1/email-notifications/resend-code',
    'POST',
    { defaultErrorMessage: 'Failed to resend verification code' }
  );

  const handleEmergencyReplyMutation = useApiMutation<{
    message: string;
    replied_at: string;
    success: boolean;
  }, EmergencyReplyRequest>(
    '/api/v1/email-notifications',
    'POST',
    { defaultErrorMessage: 'Failed to handle emergency reply' }
  );

  // Convenience methods
  const createEmailNotification = useCallback(async (data: CreateEmailNotificationRequest) => {
    const result = await createEmailNotificationMutation.mutate(data);
    if (createEmailNotificationMutation.error) {
      throw new ApiError(
        createEmailNotificationMutation.error.message,
        'CREATE_EMAIL_NOTIFICATION_FAILED'
      );
    }
    return result;
  }, [createEmailNotificationMutation]);

  const updateEmailNotification = useCallback(async (email: string, data: UpdateEmailNotificationRequest) => {
    return updateEmailNotificationMutation.mutate({ email, data });
  }, [updateEmailNotificationMutation]);

  const deleteEmailNotification = useCallback(async (email: string) => {
    return deleteEmailNotificationMutation.mutate({ email });
  }, [deleteEmailNotificationMutation]);

  const verifyEmail = useCallback(async (data: VerifyEmailRequest) => {
    return verifyEmailMutation.mutate(data);
  }, [verifyEmailMutation]);

  const resendVerificationCode = useCallback(async (data: ResendCodeRequest) => {
    return resendVerificationCodeMutation.mutate(data);
  }, [resendVerificationCodeMutation]);

  const handleEmergencyReply = useCallback(async (data: EmergencyReplyRequest) => {
    return handleEmergencyReplyMutation.mutate(data);
  }, [handleEmergencyReplyMutation]);

  // Legacy methods for backward compatibility
  const getEmailNotifications = useCallback(async (filters?: EmailNotificationFilters): Promise<EmailNotificationListResponse> => {
    const hook = useFilteredApi<EmailNotificationListResponse, EmailNotificationFilters>(
      '/api/v1/email-notifications',
      filters || {}
    );
    await hook.refetch();
    if (hook.error) throw hook.error;
    return hook.data!;
  }, []);

  const getEmailLogs = useCallback(async (filters?: EmailNotificationFilters): Promise<EmailLog[]> => {
    const hook = useFilteredApi<EmailLog[], EmailNotificationFilters>(
      '/api/v1/email-notifications/logs',
      filters || {}
    );
    await hook.refetch();
    if (hook.error) throw hook.error;
    return hook.data!;
  }, []);

  const getVerifiedEmails = useCallback(async (): Promise<EmailNotification[]> => {
    const hook = useApiBase<EmailNotification[]>('/api/v1/email-notifications/verified-emails');
    await hook.refetch();
    if (hook.error) throw hook.error;
    return hook.data!;
  }, []);

  const getEmailNotificationByEmail = useCallback(async (email: string): Promise<EmailNotification> => {
    const hook = useApiBase<EmailNotification>(`/api/v1/email-notifications/${encodeURIComponent(email)}`);
    await hook.refetch();
    if (hook.error) throw hook.error;
    return hook.data!;
  }, []);

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
    resendVerificationCode,
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