// components/email-address/AddEmailAddressForm.tsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput'; // Adjust path
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import FeishuIcon from '../images/feishu.png';
import LarkIcon from '../images/lark.png';
import TelegramIcon from '../images/telegram.png';

interface AddCannelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void; // Callback to trigger re-fetch in parent
}

const channelList = [
	{
		type: 'feishu',
		name: 'Feishu',
		icon: FeishuIcon.src,
		configLabel: 'https://open.larksuite.com/open-apis/bot/v2/hook/xxxx-xxxx-xxxx-xxxx',
	},
	{
		type: 'lark',
		name: 'Lark',
		icon: LarkIcon.src,
		configLabel: 'https://open.larksuite.com/open-apis/bot/v2/hook/xxxx-xxxx-xxxx-xxxx',
	},
	{
		type: 'telegram',
		name: 'Telegram',
		icon: TelegramIcon.src,
		configLabel: 'xxxxxx:xxxxxxxxxxxxxxxxxxxxxxx',
	},
];

const AddCannelModal: React.FC<AddCannelModalProps> = ({ isOpen, onClose, onSuccess }) => {
	const t = useTranslations('Notify.addChannelModal');
	const [emailAddress, setEmailAddress] = useState('');
	const [emailRemark, setEmailRemark] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [_, setIsFirstTime] = useState(true);
	const { request: verifyEmail } = useApi();
	const [currentChannel, setCurrentChannel] = useState(channelList[0]);

	// Debounce email verification
	useEffect(() => {}, [verificationCode, emailAddress, verifyEmail, t]);

	const handleCancel = () => {
		onClose(); // Call the onClose prop
		// Reset form state
		setEmailAddress('');
		setEmailRemark('');
		setVerificationCode('');
	};

	const handleSave = async () => {
		if (verificationCode.length === 6 && emailAddress) {
			try {
				await verifyEmail('/api/v1/emails/verify', {
					email: emailAddress,
					code: verificationCode,
				});
				setIsFirstTime(false);
				toast.success(t('emailVerificationSuccess'));
			} catch (error) {
				console.error('Email verification failed:', error);
				toast.error(
					t('emailVerificationError', {
						message: error instanceof Error ? error.message : t('unknownError'),
					})
				);
			}
		}

		try {
			// Email notification was already created in handleSendCode, just need to confirm verification
			toast.success(t('channelAddedSuccessfully'));
			onSuccess();
			onClose();
			// Reset form state
			setEmailAddress('');
			setEmailRemark('');
			setVerificationCode('');
		} catch (error) {
			console.error('Failed to save mailbox:', error);
			toast.error(
				t('saveChannelError', {
					message: error instanceof Error ? error.message : t('unknownError'),
				})
			);
		}
	};

	if (!isOpen) {
		return null; // Don't render anything if the modal is not open
	}

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 '>
			<div
				className='bg-white  rounded-lg border border-gray-200 flex flex-col'
				style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }} // Added maxHeight and overflowY
			>
				<div className='p-6'>
					<SectionHeader title={t('title')} description={t('description')} />
					<div className='flex flex-col mb-4'>
						<div className='block text-sm font-medium mb-1'>{t('method')}</div>
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild className='flex justify-between items-center cursor-pointer h-9 w-38'>
									<Button variant='outline' size='sm'>
										<div className='flex gap-2 rounded-full overflow-hidden'>
											{currentChannel?.icon && <Image src={currentChannel.icon} alt={currentChannel.name ?? ''} width={20} height={20} />}
											<div className='hidden sm:inline'>{currentChannel?.name ?? 'Unsupported Chain'}</div>
										</div>
										<ChevronDown className='ml-2 h-3 w-3' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-38 bg-white border border-gray-200 p-2 flex flex-col gap-2 rounded-md' align='end'>
									{Array.isArray(channelList) &&
										channelList.map(channel => (
											<DropdownMenuItem key={channel.type} onClick={() => setCurrentChannel(channel)} className={`flex gap-2 items-center cursor-pointer`}>
												<div className='flex gap-2'>
													<Image className='rounded-full overflow-hidden h-[20px] w-[20px]' src={channel.icon} alt={channel.name} width={20} height={20} />
													<span className='font-medium text-sm'>{channel.name}</span>
												</div>
											</DropdownMenuItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<TextInput label={t('remark')} value={emailRemark} onChange={setEmailRemark} placeholder={t('remarkPlaceholder')} />
					<TextInput label={t('config')} value={emailRemark} onChange={setEmailRemark} placeholder={currentChannel?.configLabel} />
				</div>

				<div className='flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200'>
					<button type='button' onClick={handleCancel} className='bg-white px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'>
						{t('cancel')}
					</button>
					<button type='button' onClick={handleSave} className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors'>
						{t('save')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddCannelModal;
