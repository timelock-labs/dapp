'use client';

import { useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/store/userStore';

// Email notification data types based on API documentation
export interface EmailNotification {
  created_at: string;
  email: string;
  email_remark: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  timelock_contracts: string[];
  updated_at: string;
}

// Custom error class for API errors
export class ApiError extends Error {
  public code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

export interface EmailNotificationListResponse {
  items: EmailNotification[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface EmailLog {
  created_at: string;
  email: string;
  event_type: string;
  id: number;
  is_emergency: boolean;
  is_replied: boolean;
  replied_at: string;
  send_status: string;
  sent_at: string;
  subject: string;
  timelock_address: string;
  transaction_hash: string;
}

export interface CreateEmailNotificationRequest {
  email: string;
  email_remark: string;
  timelock_contracts: string[];
}

export interface UpdateEmailNotificationRequest {
  email_remark: string;
  timelock_contracts: string[];
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ResendCodeRequest {
  email: string;
}

export interface EmergencyReplyRequest {
  token: string;
}

export interface EmailNotificationFilters {
  page?: number;
  page_size?: number;
}

export const useNotificationApi = () => {
  const { request } = useApi();
  const accessToken = useAuthStore((state) => state.accessToken);

  const createHeaders = useCallback(() => ({
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  // Get email notification list
  const getEmailNotifications = useCallback(async (filters?: EmailNotificationFilters): Promise<EmailNotificationListResponse> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = `/api/v1/email-notifications${queryString ? `?${queryString}` : ''}`;

    const response = await request(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch email notifications');
    }

    return response.data;
  }, [request, createHeaders]);

  // Create new email notification
  const createEmailNotification = useCallback(async (data: CreateEmailNotificationRequest): Promise<EmailNotification> => {
    const response = await request('/api/v1/email-notifications', {
      method: 'POST',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new ApiError(response?.error?.message || 'Failed to create email notification', response?.error?.code);
    }

    return response.data;
  }, [request, createHeaders]);

  // Handle emergency email reply confirmation
  const handleEmergencyReply = useCallback(async (data: EmergencyReplyRequest): Promise<{ message: string; replied_at: string; success: boolean }> => {
    const response = await request('/api/v1/email-notifications', {
      method: 'POST',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to handle emergency reply');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get email logs
  const getEmailLogs = useCallback(async (filters?: EmailNotificationFilters): Promise<EmailLog[]> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.page_size) params.append('page_size', filters.page_size.toString());

    const queryString = params.toString();
    const url = `/api/v1/email-notifications/logs${queryString ? `?${queryString}` : ''}`;

    const response = await request(url, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch email logs');
    }

    return response.data;
  }, [request, createHeaders]);

  // Resend verification code
  const resendVerificationCode = useCallback(async (data: ResendCodeRequest): Promise<string> => {
    const response = await request('/api/v1/email-notifications/resend-code', {
      method: 'POST',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to resend verification code');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get verified emails
  const getVerifiedEmails = useCallback(async (): Promise<EmailNotification[]> => {
    const response = await request('/api/v1/email-notifications/verified-emails', {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch verified emails');
    }

    return response.data;
  }, [request, createHeaders]);

  // Verify email with code
  const verifyEmail = useCallback(async (data: VerifyEmailRequest): Promise<string> => {
    const response = await request('/api/v1/email-notifications/verify', {
      method: 'POST',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to verify email');
    }

    return response.data;
  }, [request, createHeaders]);

  // Get email notification by email
  const getEmailNotificationByEmail = useCallback(async (email: string): Promise<EmailNotification> => {
    const response = await request(`/api/v1/email-notifications/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to fetch email notification details');
    }

    return response.data;
  }, [request, createHeaders]);

  // Update email notification
  const updateEmailNotification = useCallback(async (email: string, data: UpdateEmailNotificationRequest): Promise<EmailNotification> => {
    const response = await request(`/api/v1/email-notifications/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: data,
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to update email notification');
    }

    return response.data;
  }, [request, createHeaders]);

  // Delete email notification
  const deleteEmailNotification = useCallback(async (email: string): Promise<string> => {
    const response = await request(`/api/v1/email-notifications/${encodeURIComponent(email)}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    if (!response?.success) {
      throw new Error(response?.error?.message || 'Failed to delete email notification');
    }

    return response.data;
  }, [request, createHeaders]);

  return {
    getEmailNotifications,
    createEmailNotification,
    handleEmergencyReply,
    getEmailLogs,
    resendVerificationCode,
    getVerifiedEmails,
    verifyEmail,
    getEmailNotificationByEmail,
    updateEmailNotification,
    deleteEmailNotification,
  };
};