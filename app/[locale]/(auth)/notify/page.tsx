"use client"
"use client";
import React, { useState, useEffect } from 'react';
import EmailRulesHeader from './components/email-notifications/EmailRulesHeader';
import MailboxCard from './components/email-notifications/MailboxCard';
import AddMailboxCard from './components/email-notifications/AddMailboxCard';
import AddMailboxModal from "./components/email-address/AddMailboxModal";
import EditMailboxModal from "./components/email-address/EditMailboxModal";
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface EmailNotification {
  created_at: string;
  email: string;
  email_remark: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  timelock_contracts: string[];
  updated_at: string;
}

const EmailNotificationPage: React.FC = () => {
  const t = useTranslations('Notify');
  const [mailboxes, setMailboxes] = useState<EmailNotification[]>([]);
  const [isAddMailboxModalOpen, setIsAddMailboxModalOpen] = useState(false);
  const [isEditMailboxModalOpen, setIsEditMailboxModalOpen] = useState(false);
  const [editingMailbox, setEditingMailbox] = useState<EmailNotification | null>(null);

  const { data: emailListResponse, request: fetchEmailList, isLoading, error } = useApi();
  const { data: deleteEmailResponse, request: deleteEmail } = useApi();

  useEffect(() => {
    fetchEmailList('/api/v1/email-notifications', {
      method: 'GET',
    });
  }, [fetchEmailList, deleteEmailResponse]);

  useEffect(() => {
    if (emailListResponse && emailListResponse.success) {
      setMailboxes(emailListResponse.data.items);
      toast.success(t('fetchEmailListSuccess'));
    } else if (emailListResponse && !emailListResponse.success) {
      toast.error(t('fetchEmailListError', { message: emailListResponse.error?.message || 'Unknown error' }));
    }
  }, [emailListResponse, t]);

  useEffect(() => {
    if (error) {
      console.error('API Error:', error);
    }
  }, [error]);

  const handleDeleteMailbox = async (id: number, email: string) => {
    if (window.confirm(t('confirmDeleteMailbox', { email })) ) {
      const response = await deleteEmail(`/api/v1/email-notifications/${email}`, {
        method: 'DELETE',
      });
      if (response && response.success) {
        toast.success(t('deleteMailboxSuccess'));
      } else if (response && !response.success) {
        toast.error(t('deleteMailboxError', { message: response.error?.message || 'Unknown error' }));
      }
    }
  };

  const handleAddMailboxSuccess = () => {
    fetchEmailList('/api/v1/email-notifications', { method: 'GET' });
  };

  const handleEditMailbox = (mailbox: EmailNotification) => {
    setEditingMailbox(mailbox);
    setIsEditMailboxModalOpen(true);
  };

  const handleEditMailboxSuccess = () => {
    fetchEmailList('/api/v1/email-notifications', { method: 'GET' });
  };

  if (isLoading) {
    return <PageLayout title={t('title')}>Loading...</PageLayout>;
  }

  if (error) {
    return <PageLayout title={t('title')}>Error: {error.message}</PageLayout>;
  }

  return (
    <PageLayout title={t('title')}>
      <div className="flex flex-col space-y-8">
        {/* Email Rules Header */}
        <EmailRulesHeader />

        {/* Mailbox Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mailboxes.map((mailbox) => (
            <MailboxCard
              key={mailbox.id}
              id={mailbox.id}
              name={mailbox.email_remark}
              email={mailbox.email}
              onDelete={handleDeleteMailbox}
              onEdit={handleEditMailbox}
            />
          ))}
          {/* Add Mailbox Card */}
          <AddMailboxCard onClick={() => setIsAddMailboxModalOpen(true)} />
        </div>
      </div>

      {/* Add Mailbox Modal (Conditional Rendering) */}
      <AddMailboxModal
        isOpen={isAddMailboxModalOpen}
        onClose={() => setIsAddMailboxModalOpen(false)}
        onSuccess={handleAddMailboxSuccess}
      />

      {/* Edit Mailbox Modal (Conditional Rendering) */}
      <EditMailboxModal
        isOpen={isEditMailboxModalOpen}
        onClose={() => setIsEditMailboxModalOpen(false)}
        onSuccess={handleEditMailboxSuccess}
        initialData={editingMailbox}
      />
    </PageLayout>
  );
};

export default EmailNotificationPage;