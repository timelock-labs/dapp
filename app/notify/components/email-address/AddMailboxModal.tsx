// components/email-address/AddEmailAddressForm.tsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput'; // Adjust path
import VerificationCodeInput from './VerificationCodeInput'; // Adjust path
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useApi } from '@/hooks/useApi';

interface AddMailboxModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void; // Callback to trigger re-fetch in parent
}

const AddMailboxModal: React.FC<AddMailboxModalProps> = ({ isOpen, onClose, onSuccess }) => {
	const t = useTranslations('Notify.addMailbox');
	const [emailAddress, setEmailAddress] = useState('');
	const [emailRemark, setEmailRemark] = useState('');
	const [verificationCode, setVerificationCode] = useState('');
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [isFirstTime, setIsFirstTime] = useState(true);

	const { request: sendVerificationCode } = useApi();
	const { request: verifyEmail } = useApi();

	// Debounce email verification
	useEffect(() => {
		if (verificationCode.length === 6 && emailAddress) {
			const handler = setTimeout(async () => {
				try {
					await verifyEmail('/api/v1/emails/verify', {
						email: emailAddress,
						code: verificationCode,
					});
					setIsEmailVerified(true);
					setIsFirstTime(false);
					toast.success(t('emailVerificationSuccess'));
				} catch (error) {
					console.error('Email verification failed:', error);
					setIsEmailVerified(false);
					toast.error(
						t('emailVerificationError', {
							message: error instanceof Error ? error.message : t('unknownError'),
						})
					);
				}
			}, 500); // 500ms debounce time

			return () => {
				clearTimeout(handler);
			};
		}
	}, [verificationCode, emailAddress, verifyEmail, t]);

	const handleVerificationCodeChange = (code: string) => {
		setVerificationCode(code);
	};

	const handleSendCode = async () => {
		if (!emailAddress || !emailRemark) {
			toast.error(t('emailAndRemarkRequired'));
			return;
		}

		try {
			try {
				await sendVerificationCode('/api/v1/emails/send-verification', { email: emailAddress, remark: emailRemark });
				toast.success(t('verificationCodeSent'));
			} catch {}
		} catch (error) {
			console.error('Failed to send verification code:', error);
			toast.error(
				t('addMailboxError', {
					message: error instanceof Error ? error.message : t('unknownError'),
				})
			);
		}
	};

	const handleCancel = () => {
		onClose(); // Call the onClose prop
		// Reset form state
		setEmailAddress('');
		setEmailRemark('');
		setVerificationCode('');
		setIsEmailVerified(false);
	};

	const handleSave = async () => {
		if (!isEmailVerified) {
			toast.error(t('pleaseVerifyEmailFirst'));
			return;
		}

		try {
			// Email notification was already created in handleSendCode, just need to confirm verification
			toast.success(t('mailboxAddedSuccessfully'));
			onSuccess();
			onClose();
			// Reset form state
			setEmailAddress('');
			setEmailRemark('');
			setVerificationCode('');
		} catch (error) {
			console.error('Failed to save mailbox:', error);
			toast.error(
				t('saveMailboxError', {
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
				className='bg-white  rounded-lg shadow-xl border border-gray-200 flex flex-col'
				style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }} // Added maxHeight and overflowY
			>
				<div className='p-6'>
					<SectionHeader title={t('title')} description={t('description')} />
					<TextInput label={t('emailAddress')} value={emailAddress} onChange={setEmailAddress} placeholder={t('emailPlaceholder')} />
					<TextInput label={t('emailRemark')} value={emailRemark} onChange={setEmailRemark} placeholder={t('remarkPlaceholder')} />
					<VerificationCodeInput
						email={emailAddress}
						onSendCode={handleSendCode}
						onCodeChange={handleVerificationCodeChange}
						codeLength={6}
						buttonText={isFirstTime ? t('sendCode') : t('resendCode')}
						disabledText={isFirstTime ? t('adding') : t('resending')}
						isFirstTime={isFirstTime}
					/>

					{verificationCode.length === 6 && (
						<div className={`mb-4 p-3 rounded-md ${isEmailVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
							{isEmailVerified ?
								<div className='flex items-center'>
									<span className='text-green-500 mr-2'>✓</span>
									{t('verificationSuccess')}
								</div>
							:	<div className='flex items-center'>
									<span className='text-red-500 mr-2'>✗</span>
									{t('verificationCodeIncorrect')}
								</div>
							}
						</div>
					)}
				</div>

				<div className='flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200'>
					<button
						type='button'
						onClick={handleCancel}
						className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'>
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

export default AddMailboxModal;
