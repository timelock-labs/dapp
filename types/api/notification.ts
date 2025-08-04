/**
 * Email notification API types
 */

import type { PaginationResponse } from '../common';

/**
 * Email notification entity
 */
export interface EmailNotification {
  id: string;
  email: string;
  email_remark?: string;
  timelock_contracts: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
  verification_code?: string;
  verification_expires_at?: string;
}

/**
 * Email notification list response
 */
export interface EmailNotificationListResponse extends PaginationResponse {
  items: EmailNotification[];
}

/**
 * Email log entry
 */
export interface EmailLog {
  id: string;
  email: string;
  subject: string;
  content: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  timelock_contract?: string;
  transaction_hash?: string;
}

/**
 * Create email notification request
 */
export interface CreateEmailNotificationRequest {
  email: string;
  email_remark?: string;
  timelock_contracts: string[];
}

/**
 * Update email notification request
 */
export interface UpdateEmailNotificationRequest {
  email_remark?: string;
  timelock_contracts?: string[];
}

/**
 * Verify email request
 */
export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

/**
 * Resend verification code request
 */
export interface ResendCodeRequest {
  email: string;
}

/**
 * Emergency reply request
 */
export interface EmergencyReplyRequest {
  email: string;
  message: string;
  transaction_hash?: string;
}

/**
 * Email notification filters
 */
export interface EmailNotificationFilters {
  [key: string]: string | number | boolean | undefined;
  email?: string;
  verified?: boolean;
  timelock_contract?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}