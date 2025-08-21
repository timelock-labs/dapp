'use client';
import React, { useState, useEffect, useCallback } from 'react';
import EmailRulesHeader from './components/email/email-notifications/EmailRulesHeader';
import MailboxCard from './components/email/email-notifications/MailboxCard';
import AddMailboxCard from './components/email/email-notifications/AddMailboxCard';
import AddMailboxModal from './components/email/email-address/AddMailboxModal';
import EditMailboxModal from './components/email/email-address/EditMailboxModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Channel from './components/channel';

import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';

const EmailNotificationPage: React.FC = () => {
	const t = useTranslations('Notify');
	const [mailboxes, setMailboxes] = useState<Array<{ id: string; email: string; remark?: string; created_at: string; is_verified: boolean }>>([]);
	const [isAddMailboxModalOpen, setIsAddMailboxModalOpen] = useState(false);
	const [isEditMailboxModalOpen, setIsEditMailboxModalOpen] = useState(false);
	const [editingMailbox, setEditingMailbox] = useState<{ id: string; email: string; remark?: string; created_at: string } | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
		isOpen: boolean;
		email: string;
		id: number;
	}>({ isOpen: false, email: '', id: 0 });

	const { request: deleteEmailNotification } = useApi();
	const { request: getEmailNotifications } = useApi();

	// Fetch email notifications
	const fetchEmailNotifications = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data } = await getEmailNotifications('/api/v1/emails', { page: 1, page_size: 50 });
			setMailboxes(data?.emails || []);
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
			await deleteEmailNotification('/api/v1/emails/delete', { id: deleteConfirmDialog.id });
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

	const handleEditMailbox = (mailbox: { id: string; email: string; remark?: string; created_at: string }) => {
		setEditingMailbox(mailbox);
		setIsEditMailboxModalOpen(true);
	};

	const handleEditMailboxSuccess = () => {
		fetchEmailNotifications();
	};

	// Mailbox Card Skeleton Component
	const MailboxCardSkeleton = () => (
		<div className='bg-white rounded-lg border border-gray-200 p-6'>
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
			<div className='flex flex-col space-y-8'>
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

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
					<MailboxCardSkeleton />
					<MailboxCardSkeleton />
					<AddMailboxCardSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col space-y-8'>
			<Channel />
			<div className='flex flex-col space-y-8'>
				<div className='text-2xl font-bold mb-6'>邮箱通知</div>
				<EmailRulesHeader />
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
									remark={mailbox.remark}
									created_at={mailbox.created_at}
								/>
							)
					)}
					<AddMailboxCard onClick={() => setIsAddMailboxModalOpen(true)} />
				</div>
			</div>

			{/* Add Mailbox Modal (Conditional Rendering) */}
			<AddMailboxModal isOpen={isAddMailboxModalOpen} onClose={() => setIsAddMailboxModalOpen(false)} onSuccess={handleAddMailboxSuccess} />

			{/* Edit Mailbox Modal (Conditional Rendering) */}
			<EditMailboxModal isOpen={isEditMailboxModalOpen} onClose={() => setIsEditMailboxModalOpen(false)} onSuccess={handleEditMailboxSuccess} initialData={editingMailbox} />

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
		</div>
	);
};

export default EmailNotificationPage;
