"use client";
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TextInput from '@/components/ui/TextInput';
import ListeningPermissions from './ListeningPermissions';
import { useNotificationApi, EmailNotification } from '@/hooks/useNotificationApi';
import { useTimelockApi } from '@/hooks/useTimelockApi';
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
  const [emailRemark, setEmailRemark] = useState(initialData?.email_remark || '');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialData?.timelock_contracts || []);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingTimelocks, setIsLoadingTimelocks] = useState(false);

  const { updateEmailNotification } = useNotificationApi();
  const { getTimelockList } = useTimelockApi();

  const fetchTimelocks = useCallback(async () => {
    setIsLoadingTimelocks(true);
    try {
      const response = await getTimelockList({ status: 'active' });
      if (response.success && response.data) {
        const timelockPermissions: Permission[] = [];
        
        // Add Compound timelocks
        if (response.data.compound_timelocks) {
          response.data.compound_timelocks.forEach((timelock: TimelockData) => {
            timelockPermissions.push({
              id: timelock.contract_address,
              label: `${timelock.remark || 'Compound Timelock'} (${timelock.chain_name})`,
              subLabel: timelock.contract_address,
              icon: <span className="text-yellow-500 text-base">🪙</span>
            });
          });
        }

        // Add OpenZeppelin timelocks
        if (response.data.openzeppelin_timelocks) {
          response.data.openzeppelin_timelocks.forEach((timelock: TimelockData) => {
            timelockPermissions.push({
              id: timelock.contract_address,
              label: `${timelock.remark || 'OpenZeppelin Timelock'} (${timelock.chain_name})`,
              subLabel: timelock.contract_address,
              icon: <span className="text-blue-500 text-base">🔷</span>
            });
          });
        }

        setPermissions(timelockPermissions);
      }
    } catch (error) {
      console.error('Failed to fetch timelocks:', error);
      toast.error('获取Timelock列表失败');
    } finally {
      setIsLoadingTimelocks(false);
    }
  }, [getTimelockList]);

  useEffect(() => {
    if (initialData) {
      setEmailRemark(initialData.email_remark);
      setSelectedPermissions(initialData.timelock_contracts);
    }
  }, [initialData]);

  // Fetch timelock list when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTimelocks();
    }
  }, [isOpen, fetchTimelocks]);

  const handlePermissionChange = (id: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, id] : prev.filter((permId) => permId !== id)
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
      toast.error('邮箱备注不能为空！');
      return;
    }

    if (!initialData?.email) {
      toast.error('无法获取邮箱地址进行更新！');
      return;
    }

    try {
      await updateEmailNotification(initialData.email, {
        email_remark: emailRemark,
        timelock_contracts: selectedPermissions,
      });

      toast.success('邮箱通知配置更新成功！');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update mailbox:', error);
      toast.error(`更新邮箱通知配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
        style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className='p-6'>
          <SectionHeader
            title="编辑邮箱地址"
            description="更新您的邮箱备注和监听权限。"
          />

          <TextInput
            label="邮箱地址 (不可编辑)"
            value={initialData?.email || ''}
            onChange={() => {}} // Read-only
            placeholder=""
            disabled
          />

          <TextInput
            label="邮箱备注"
            value={emailRemark}
            onChange={setEmailRemark}
            placeholder=""
          />

          {isLoadingTimelocks ? (
            <div className="py-4 text-center text-gray-500">加载Timelock列表中...</div>
          ) : (
            <ListeningPermissions
              permissions={permissions}
              selectedPermissions={selectedPermissions}
              onPermissionChange={handlePermissionChange}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMailboxModal;