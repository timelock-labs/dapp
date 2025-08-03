'use client';
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TextInput from '@/components/ui/TextInput';
import ListeningPermissions from './ListeningPermissions';
import { useNotificationApi, EmailNotification } from '@/hooks/useNotificationApi';
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

interface EditMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to trigger re-fetch in parent
  initialData: EmailNotification | null; // Data of the mailbox to edit
}

const EditMailboxModal: React.FC<EditMailboxModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const t = useTranslations('Notify.editMailbox');
  const [emailRemark, setEmailRemark] = useState(initialData?.email_remark || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialData?.timelock_contracts || []
  );
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const { updateEmailNotification } = useNotificationApi();
  const { useTimelockList } = useTimelockApi();
  
  // Only fetch when modal is open
  const { data: timelockData, isLoading: isLoadingTimelocks, error: timelockError } = useTimelockList(
    isOpen ? { status: 'active' } : undefined
  );

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
      console.error('Failed to fetch timelocks:', timelockError);
      toast.error(t('fetchTimelockListError'));
    }
  }, [timelockError, t]);

  useEffect(() => {
    if (initialData) {
      setEmailRemark(initialData.email_remark);
      setSelectedPermissions(initialData.timelock_contracts);
    }
  }, [initialData]);

  const handlePermissionChange = (id: string, checked: boolean) => {
    setSelectedPermissions(prev =>
      checked ? [...prev, id] : prev.filter(permId => permId !== id)
    );
  };

  const handleCancel = () => {
    onClose();
    // Reset form state on cancel
    setEmailRemark(initialData?.email_remark || '');
    setSelectedPermissions(initialData?.timelock_contracts || []);
  };

  const handleSave = async () => {
    if (!emailRemark) {
      toast.error(t('emailRemarkRequired'));
      return;
    }

    if (!initialData?.email) {
      toast.error(t('cannotGetEmailAddress'));
      return;
    }

    try {
      await updateEmailNotification(initialData.email, {
        email_remark: emailRemark,
        timelock_contracts: selectedPermissions,
      });

      toast.success(t('updateSuccess'));
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update mailbox:', error);
      toast.error(
        t('updateError', { message: error instanceof Error ? error.message : t('unknownError') })
      );
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div
        className='bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col'
        style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className='p-6'>
          <SectionHeader title={t('title')} description={t('description')} />

          <TextInput
            label={t('emailAddressReadOnly')}
            value={initialData?.email || ''}
            onChange={() => {}} // Read-only
            placeholder=''
            disabled
          />

          <TextInput
            label={t('emailRemark')}
            value={emailRemark}
            onChange={setEmailRemark}
            placeholder=''
          />

          {/* Listening Permissions Section */}
          <ListeningPermissions
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
            isLoading={isLoadingTimelocks}
          />
        </div>

        <div className='flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200'>
          <button
            type='button'
            onClick={handleCancel}
            className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleSave}
            className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors'
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMailboxModal;
