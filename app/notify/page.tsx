'use client';
import React, { useState, useEffect, useCallback } from 'react';
import EmailRulesHeader from './components/email-notifications/EmailRulesHeader';
import MailboxCard from './components/email-notifications/MailboxCard';
import AddMailboxCard from './components/email-notifications/AddMailboxCard';
import AddMailboxModal from './components/email-address/AddMailboxModal';
import EditMailboxModal from './components/email-address/EditMailboxModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import PageLayout from '@/components/layout/PageLayout';
import { Skeleton } from '@/components/ui/skeleton';
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

  const { getEmailNotifications, deleteEmailNotification } = useNotificationApi();

  // Fetch email notifications
  const fetchEmailNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getEmailNotifications({ page: 1, page_size: 50 });
      setMailboxes(response?.emails || []);
    } catch (error) {
      console.error('Failed to fetch email notifications:', error);
      toast.error(
        t('fetchEmailListError', {
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      );
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
      await deleteEmailNotification(deleteConfirmDialog.id);
      toast.success(t('deleteMailboxSuccess'));
      await fetchEmailNotifications(); // Refresh data
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(
        t('deleteMailboxError', {
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      );
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

  // Mailbox Card Skeleton Component
  const MailboxCardSkeleton = () => (
    <div className='bg-white rounded-lg border border-gray-200 p-6 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <Skeleton className='h-5 w-24' />
        <div className='flex space-x-2'>
          <Skeleton className='h-8 w-8 rounded' />
          <Skeleton className='h-8 w-8 rounded' />
        </div>
      </div>
      <div className='space-y-3'>
        <div>
          <Skeleton className='h-4 w-16 mb-1' />
          <Skeleton className='h-4 w-32' />
        </div>
        <div>
          <Skeleton className='h-4 w-12 mb-1' />
          <Skeleton className='h-4 w-48' />
        </div>
        <div>
          <Skeleton className='h-4 w-20 mb-1' />
          <Skeleton className='h-4 w-28' />
        </div>
      </div>
    </div>
  );

  // Add Mailbox Card Skeleton
  const AddMailboxCardSkeleton = () => (
    <div className='bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center min-h-[200px]'>
      <Skeleton className='h-12 w-12 rounded-full mb-4' />
      <Skeleton className='h-5 w-24 mb-2' />
      <Skeleton className='h-4 w-32' />
    </div>
  );

  if (isLoading) {
    return (
      <PageLayout title={t('title')}>
        <div className='flex flex-col space-y-8'>
          {/* Email Rules Header Skeleton */}
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-48' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-5/6' />
              </div>
            </div>
          </div>

          {/* Mailbox Cards Grid Skeleton */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Show 2 mailbox card skeletons + 1 add card skeleton */}
            <MailboxCardSkeleton />
            <MailboxCardSkeleton />
            <AddMailboxCardSkeleton />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('title')}>
      <div className='flex flex-col space-y-8'>
        {/* Email Rules Header */}
        <EmailRulesHeader />

        {/* Mailbox Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {mailboxes.map(
            mailbox =>
              mailbox.is_verified && (
                <MailboxCard
                  onDelete={handleDeleteMailbox}
                  onEdit={handleEditMailbox}
                  key={mailbox.id}
                  id={parseInt(mailbox.id)}
                  email={mailbox.email}
                  remark={mailbox.email_remark}
                  created_at={mailbox.created_at}
                />
              )
          )}
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
        variant='destructive'
      />
    </PageLayout>
  );
};

export default EmailNotificationPage;
