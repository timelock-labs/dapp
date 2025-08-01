"use client"
import React, { useState, useEffect, useCallback } from 'react';
import EmailRulesHeader from './components/email-notifications/EmailRulesHeader';
import MailboxCard from './components/email-notifications/MailboxCard';
import AddMailboxCard from './components/email-notifications/AddMailboxCard';
import AddMailboxModal from "./components/email-address/AddMailboxModal";
import EditMailboxModal from "./components/email-address/EditMailboxModal";
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import { useNotificationApi, EmailNotification } from '@/hooks/useNotificationApi';
import { toast } from 'sonner';

const EmailNotificationPage: React.FC = () => {
  const t = useTranslations('Notify');
  const [mailboxes, setMailboxes] = useState<EmailNotification[]>([]);
  const [isAddMailboxModalOpen, setIsAddMailboxModalOpen] = useState(false);
  const [isEditMailboxModalOpen, setIsEditMailboxModalOpen] = useState(false);
  const [editingMailbox, setEditingMailbox] = useState<EmailNotification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    email: string;
    id: number;
  }>({ isOpen: false, email: '', id: 0 });

  const {
    getEmailNotifications,
    deleteEmailNotification
  } = useNotificationApi();

  // Fetch email notifications
  const fetchEmailNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEmailNotifications({ page: 1, page_size: 50 });
      setMailboxes(response.items || []);
    } catch (error) {
      console.error('Failed to fetch email notifications:', error);
      toast.error(t('fetchEmailListError', { message: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setIsLoading(false);
    }
  }, [getEmailNotifications, t]);

  useEffect(() => {
    fetchEmailNotifications();
  }, [fetchEmailNotifications]);

  const handleDeleteMailbox = (id: number, email: string) => {
    setDeleteConfirmDialog({ isOpen: true, email, id });
  };

  const confirmDeleteMailbox = async () => {
    try {
      await deleteEmailNotification(deleteConfirmDialog.email);
      toast.success(t('deleteMailboxSuccess'));
      await fetchEmailNotifications(); // Refresh data
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(t('deleteMailboxError', { message: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setDeleteConfirmDialog({ isOpen: false, email: '', id: 0 });
    }
  };

  const handleAddMailboxSuccess = () => {
    fetchEmailNotifications();
  };

  const handleEditMailbox = (mailbox: EmailNotification) => {
    setEditingMailbox(mailbox);
    setIsEditMailboxModalOpen(true);
  };

  const handleEditMailboxSuccess = () => {
    fetchEmailNotifications();
  };

  if (isLoading) {
    return <PageLayout title={t('title')}>Loading...</PageLayout>;
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmDialog.isOpen}
        onClose={() => setDeleteConfirmDialog({ isOpen: false, email: '', id: 0 })}
        onConfirm={confirmDeleteMailbox}
        title={t('confirmDialog.title')}
        description={t('confirmDialog.description', { email: deleteConfirmDialog.email })}
        confirmText={t('confirmDialog.confirmText')}
        cancelText={t('confirmDialog.cancelText')}
        variant="destructive"
      />
    </PageLayout>
  );
};

export default EmailNotificationPage;