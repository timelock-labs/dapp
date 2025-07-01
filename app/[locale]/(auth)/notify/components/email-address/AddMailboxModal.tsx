// components/email-address/AddEmailAddressForm.tsx
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput';         // Adjust path
import ListeningPermissions from './ListeningPermissions'; // Adjust path
import VerificationCodeInput from './VerificationCodeInput'; // Adjust path

interface AddMailboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: string, name: string) => void;
}

const AddMailboxModal: React.FC<AddMailboxModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [emailRemark, setEmailRemark] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  // const [ _, setVerificationCode] = useState('');

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
    alert('发送验证码 button clicked!');
    console.log('Sending code to:', emailAddress);
    // Implement sending verification code logic
  };

  const handleCancel = () => {
    onClose(); // Call the onClose prop
    // Reset form state
    setEmailAddress('');
    setEmailRemark('');
    setSelectedPermissions([]);
    setVerificationCode('');
  };

  const handleSave = () => {
    // Basic validation (optional, can be more robust)
    if (!emailAddress || !emailRemark) {
      alert('邮箱地址和备注不能为空！');
      return;
    }
    onConfirm(emailAddress, emailRemark); // Call the onConfirm prop with email and remark
    // Optionally reset form state after successful save, or let onClose handle it
    setEmailAddress('');
    setEmailRemark('');
    setSelectedPermissions([]);
    setVerificationCode('');
    console.log(verificationCode);
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