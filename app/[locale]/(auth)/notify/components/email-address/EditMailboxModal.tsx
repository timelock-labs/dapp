"use client";
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import TextInput from '@/components/ui/TextInput';
import ListeningPermissions from './ListeningPermissions';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface EmailNotification {
  created_at: string;
  email: string;
  email_remark: string;
  id: number;
  is_active: boolean;
  is_verified: boolean;
  timelock_contracts: string[];
  updated_at: string;
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

  const { request: updateEmail } = useApi();

  useEffect(() => {
    if (initialData) {
      setEmailRemark(initialData.email_remark);
      setSelectedPermissions(initialData.timelock_contracts);
    }
  }, [initialData]);

  // Dummy data for permissions (replace with actual data from API if available)
  const dummyPermissions = [
    { id: 'perm1', label: 'Timelock1 (备注名称)', subLabel: '0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714', icon: <span className="text-yellow-500 text-base">🪙</span> },
    { id: 'perm2', label: 'Timelock2 (备注名称)', subLabel: '0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714', icon: <span className="text-yellow-500 text-base">🪙</span> },
    { id: 'perm3', label: 'Timelock3 (备注名称)', subLabel: '0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714', icon: <span className="text-blue-500 text-base">🔷</span> },
  ];

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

    const timelockContracts = selectedPermissions.map(permId => {
      const perm = dummyPermissions.find(p => p.id === permId);
      return perm ? perm.subLabel : '';
    }).filter(Boolean);

    const response = await updateEmail(`/api/v1/email-notifications/${initialData.email}`, {
      method: 'PUT',
      body: {
        email_remark: emailRemark,
        timelock_contracts: timelockContracts,
      },
    });

    if (response && response.success) {
      toast.success('邮箱通知配置更新成功！');
      onSuccess();
      onClose();
    } else if (response && !response.success) {
      toast.error(`更新邮箱通知配置失败: ${response.error?.message || '未知错误'}`);
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

          <ListeningPermissions
            permissions={dummyPermissions}
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
          />
        </div>

        <div className="flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
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