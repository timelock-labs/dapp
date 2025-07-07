// components/email-address/AddEmailAddressForm.tsx
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput';         // Adjust path
import ListeningPermissions from './ListeningPermissions'; // Adjust path
import VerificationCodeInput from './VerificationCodeInput'; // Adjust path
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface AddMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to trigger re-fetch in parent
}

const AddMailboxModal: React.FC<AddMailboxModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailRemark, setEmailRemark] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');

  const { data: addEmailResponse, request: addEmail } = useApi();
  const { request: verifyEmail } = useApi();

  // Dummy data for permissions
  // Consider moving this to props or fetching if it's dynamic
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

  const handleSendCode = () => {
    // The API call for sending the verification code is handled by the VerificationCodeInput component.
    // This function is a placeholder if any additional logic is needed in the parent.
  };

  const handleCancel = () => {
    onClose(); // Call the onClose prop
    // Reset form state
    setEmailAddress('');
    setEmailRemark('');
    setSelectedPermissions([]);
    setVerificationCode('');
  };

  const handleSave = async () => {
    if (!emailAddress || !emailRemark) {
      toast.error('邮箱地址和备注不能为空！');
      return;
    }

    if (!verificationCode) {
      toast.error('请输入验证码！');
      return;
    }

    const timelockContracts = selectedPermissions.map(permId => {
      const perm = dummyPermissions.find(p => p.id === permId);
      return perm ? perm.subLabel : '';
    }).filter(Boolean);

    const response = await addEmail('/api/v1/email-notifications', {
      method: 'POST',
      body: {
        email: emailAddress,
        email_remark: emailRemark,
        timelock_contracts: timelockContracts,
      },
    });

    if (response && response.success) {
      const verifyResponse = await verifyEmail('/api/v1/email-notifications/verify', {
        method: 'POST',
        body: {
          email: emailAddress,
          verification_code: verificationCode,
        },
      });

      if (verifyResponse && verifyResponse.success) {
        toast.success('邮箱地址添加成功！');
        onSuccess();
        onClose();
        setEmailAddress('');
        setEmailRemark('');
        setSelectedPermissions([]);
        setVerificationCode('');
      } else if (verifyResponse && !verifyResponse.success) {
        toast.error(`验证码验证失败: ${verifyResponse.error?.message || '未知错误'}`);
      }
    } else if (response && !response.success) {
      toast.error(`添加邮箱地址失败: ${response.error?.message || '未知错误'}`);
    }
  };

  if (!isOpen) {
    return null; // Don't render anything if the modal is not open
  }

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      {/* Modal Content */}
      <div
        className="bg-white  rounded-lg shadow-xl border border-gray-200 flex flex-col"
        style={{ width: 558, maxHeight: '90vh', overflowY: 'auto' }} // Added maxHeight and overflowY
      >
        <div className='p-6'>
 {/* Header Section */}
        <SectionHeader
          title="添加邮箱地址"
          description="输入您的全名或您想使用的显示名称。" // Updated description to Chinese
        />

        {/* Email Address Input */}
        <TextInput
          label="邮箱地址"
          value={emailAddress}
          onChange={setEmailAddress}
          placeholder="target" 
        />

        {/* Email Remark Input */}
        <TextInput
          label="邮箱备注"
          value={emailRemark}
          onChange={setEmailRemark}
          placeholder="target" 
        />

        {/* Listening Permissions Section */}
        <ListeningPermissions
          permissions={dummyPermissions}
          selectedPermissions={selectedPermissions}
          onPermissionChange={handlePermissionChange}
        />

        {/* Verification Code Input Section */}
        <VerificationCodeInput
          email={emailAddress}
          onSendCode={handleSendCode}
          onCodeChange={setVerificationCode}
          codeLength={6}
        />

        </div>
       
        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            取消 {/* Updated to Chinese */}
          </button>
          <button
            onClick={handleSave}
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            保存 {/* Updated to Chinese */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMailboxModal;