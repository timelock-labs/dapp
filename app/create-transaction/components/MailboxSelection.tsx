import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTranslations } from 'next-intl';
import type { MailboxSelectionProps } from '@/types';
import { useApi } from '@/hooks/useApi';

const MailboxSelection: React.FC<MailboxSelectionProps> = () => {
	const t = useTranslations('CreateTransaction');
	const { request: getEmailNotifications } = useApi();
	const [mailboxOptions, setMailboxOptions] = useState<Array<{ id: number; email: string; email_remark?: string }>>([]);

	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const { data } = await getEmailNotifications('/api/v1/emails', { page: 1, page_size: 100 });
				setMailboxOptions(data?.emails || []);
			} catch (error) {
				console.error('Failed to fetch email notifications:', error);
			}
		};

		fetchEmails();
	}, [getEmailNotifications]);

	return (
		// Change to vertical (top-bottom) layout
		<div className='bg-white py-6 flex flex-col gap-2 items-start'>
			{/* Top: Section Header */}
			<div>
				<SectionHeader title={t('mailbox.title')} description={t('mailbox.description')} />
			</div>

			{/* Bottom: Checkbox Options */}
			<div>
				<div className='flex flex-wrap gap-2'>
					{mailboxOptions.map(option => (
						<div key={option.id} className='flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors bg-[#F5F5F5] h-8'>
							<label htmlFor={String(option.id)} className='text-sm text-gray-700 cursor-pointer flex-1'>
								{option.email_remark || option.email}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MailboxSelection;
