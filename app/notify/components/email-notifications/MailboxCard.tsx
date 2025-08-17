import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import DeleteButton from '@/components/ui/DeleteButton';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/utils/utils';

interface MailboxCardProps {
	onDelete: (id: number, email: string) => void;
	onEdit: (mailbox: { id: string; email: string; remark?: string; created_at: string }) => void;
	id: number;
	email: string;
	remark?: string | null;
	created_at: string;
}

const MailboxCard: React.FC<MailboxCardProps> = ({ id, email, remark, created_at, onDelete, onEdit }) => {
	const t = useTranslations('Notify.mailboxCard');

	const handleDeleteClick = () => {
		onDelete(id, email);
	};

	const handleEditClick = () => {
		const mailboxData = {
			id: id.toString(),
			remark: remark,
			email: email,
			created_at: created_at,
		};
		onEdit(mailboxData);
	};

	return (
		<div className='bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between h-auto'>
			<div className='p-6'>
				<h3 className='text-lg font-semibold text-gray-900 mb-1'>{email}</h3>
				<p className='text-sm text-gray-500 mb-2'>{remark}</p>
				<div className='text-xs text-gray-700 space-y-1'>
					<div>
						<strong>Email Remark:</strong> {remark ?? '-'}
					</div>
					<div>
						<strong>Created At:</strong> {formatDate(created_at) || '-'}
					</div>
				</div>
			</div>
			<div className='pt-4 pr-4 border-t border-gray-200 flex justify-end h-[64px] space-x-2'>
				<button
					type="button"
					onClick={handleEditClick}
					className='w-[85px] h-[32px] text-center inline-flex items-center py-2 px-2 gap-py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
					<span className='flex items-center gap-2 text-[#0A0A0A]'>
						<PencilIcon className='w-4 h-4' />
						{t('edit')}
					</span>
				</button>
				<DeleteButton
					onDelete={handleDeleteClick}
					title='Are you sure you want to delete?'
					confirmText={t('delete')}
					cancelText={'Cancel'}
					variant='default'
					size='md'
					className='w-[85px] h-[32px] border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors flex items-center justify-center'
				/>
			</div>
		</div>
	);
};

export default MailboxCard;
