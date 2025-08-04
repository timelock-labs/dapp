// components/email-address/AddEmailAddressForm.tsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput'; // Adjust path
import ListeningPermissions from './ListeningPermissions'; // Adjust path
import VerificationCodeInput from './VerificationCodeInput'; // Adjust path
import { useNotificationApi } from '@/hooks/useNotificationApi';
import { useTimelockApi } from '@/hooks/useTimelockApi';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface Permission {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
}

interface TimelockData {
  contract_address: string;
  remark?: string;
  chain_name: string;
}

interface AddMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to trigger re-fetch in parent
}

const AddMailboxModal: React.FC<AddMailboxModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const t = useTranslations('Notify.addMailbox');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailRemark, setEmailRemark] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isEmailNotificationCreated, setIsEmailNotificationCreated] = useState(false);

  const { createEmailNotification, verifyEmail, resendVerificationCode } = useNotificationApi();

  const { useTimelockList } = useTimelockApi();

  // Only fetch when modal is open
  const {
    data: timelockData,
    isLoading: isLoadingTimelocks,
    error: timelockError,
  } = useTimelockList(isOpen ? { status: 'active' } : undefined);

  // Process timelock data when it changes
  useEffect(() => {
    if (timelockData) {
      const timelockPermissions: Permission[] = [];

      // Add Compound timelocks
      if (timelockData.compound_timelocks) {
        timelockData.compound_timelocks.forEach((timelock: TimelockData) => {
          timelockPermissions.push({
            id: timelock.contract_address,
            label: `${timelock.remark || 'Compound Timelock'} (${timelock.chain_name})`,
            subLabel: timelock.contract_address,
            icon: <span className='text-yellow-500 text-base'>🪙</span>,
          });
        });
      }

      // Add OpenZeppelin timelocks
      if (timelockData.openzeppelin_timelocks) {
        timelockData.openzeppelin_timelocks.forEach((timelock: TimelockData) => {
          timelockPermissions.push({
            id: timelock.contract_address,
            label: `${timelock.remark || 'OpenZeppelin Timelock'} (${timelock.chain_name})`,
            subLabel: timelock.contract_address,
            icon: <span className='text-blue-500 text-base'>🔷</span>,
          });
        });
      }

      setPermissions(timelockPermissions);
    }
  }, [timelockData]);

  // Handle timelock error
  useEffect(() => {
    if (timelockError) {
      console.error('Failed to fetch timelines:', timelockError);
      toast.error(t('fetchTimelockListError'));
    }
  }, [timelockError, t]);

  // Debounce email verification
  useEffect(() => {
    if (verificationCode.length === 6 && emailAddress) {
      const handler = setTimeout(async () => {
        try {
          await verifyEmail({
            email: emailAddress,
            verification_code: verificationCode,
          });
          setIsEmailVerified(true);
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
    } else {
      setIsEmailVerified(false);
      return undefined;
    }
  }, [verificationCode, emailAddress, verifyEmail, t]);

  const handleVerificationCodeChange = (code: string) => {
    setVerificationCode(code);
    setIsEmailVerified(false); // Reset verification status on code change
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    setSelectedPermissions(prev =>
      checked ? [...prev, id] : prev.filter(permId => permId !== id)
    );
  };

  const handleSendCode = async () => {
    if (!emailAddress || !emailRemark) {
      toast.error(t('emailAndRemarkRequired'));
      return;
    }

    try {
      if (!isEmailNotificationCreated) {
        // First time - try to create email notification
        try {
          await createEmailNotification({
            email: emailAddress,
            email_remark: emailRemark,
            timelock_contracts: selectedPermissions,
          });
          setIsEmailNotificationCreated(true);
          toast.success(t('verificationCodeSent'));
        } catch {
          // Failed to send verification code: Error: API request failed with status 409
          // // If email already exists, switch to resend mode and send code
          // if (createError.includes('API request failed with status 409')) {
          //   setIsEmailNotificationCreated(true);
          //   await resendVerificationCode({ email: emailAddress });
          //   toast.success(t('verificationCodeResent'));
          // } else {
          //   throw createError; // Re-throw other errors
          // }
        }
      } else {
        // Subsequent times - resend verification code
        await resendVerificationCode({ email: emailAddress });
        toast.success(t('verificationCodeResent'));
      }
      // Reset verification status when new code is sent
      setIsEmailVerified(false);
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
    setSelectedPermissions([]);
    setVerificationCode('');
    setIsEmailVerified(false);
    setIsEmailNotificationCreated(false);
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
      setSelectedPermissions([]);
      setVerificationCode('');
      setIsEmailVerified(false);
      setIsEmailNotificationCreated(false);
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
    // Modal Overlay
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 '>
      {/* Modal Content */}
      <div
        className='bg-white  rounded-lg shadow-xl border border-gray-200 flex flex-col'
        style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }} // Added maxHeight and overflowY
      >
        <div className='p-6'>
          {/* Header Section */}
          <SectionHeader title={t('title')} description={t('description')} />

          {/* Email Address Input */}
          <TextInput
            label={t('emailAddress')}
            value={emailAddress}
            onChange={setEmailAddress}
            placeholder={t('emailPlaceholder')}
          />

          {/* Email Remark Input */}
          <TextInput
            label={t('emailRemark')}
            value={emailRemark}
            onChange={setEmailRemark}
            placeholder={t('remarkPlaceholder')}
          />

          {/* Listening Permissions Section */}
          <ListeningPermissions
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
            isLoading={isLoadingTimelocks}
          />

          {/* Verification Code Input Section */}
          <VerificationCodeInput
            email={emailAddress}
            onSendCode={handleSendCode}
            onCodeChange={handleVerificationCodeChange}
            codeLength={6}
            buttonText={!isEmailNotificationCreated ? t('sendCode') : t('resendCode')}
            disabledText={!isEmailNotificationCreated ? t('adding') : t('resending')}
            isFirstTime={!isEmailNotificationCreated}
          />

          {/* Verification Status Indicator */}
          {verificationCode.length === 6 && (
            <div
              className={`mb-4 p-3 rounded-md ${
                isEmailVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {isEmailVerified ? (
                <div className='flex items-center'>
                  <span className='text-green-500 mr-2'>✓</span>
                  {t('verificationSuccess')}
                </div>
              ) : (
                <div className='flex items-center'>
                  <span className='text-red-500 mr-2'>✗</span>
                  {t('verificationCodeIncorrect')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className='flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleCancel}
            className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'
          >
            {t('cancel')}
          </button>
          <button
            type='button'
            onClick={handleSave}
            className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors'
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMailboxModal;
