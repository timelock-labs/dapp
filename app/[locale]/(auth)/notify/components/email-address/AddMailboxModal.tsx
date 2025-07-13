// components/email-address/AddEmailAddressForm.tsx
import React, { useState, useEffect, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import TextInput from '@/components/ui/TextInput';         // Adjust path
import ListeningPermissions from './ListeningPermissions'; // Adjust path
import VerificationCodeInput from './VerificationCodeInput'; // Adjust path
import { useNotificationApi } from '@/hooks/useNotificationApi';
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
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingTimelocks, setIsLoadingTimelocks] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const {
    createEmailNotification,
    verifyEmail,
    resendVerificationCode
  } = useNotificationApi();

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
      console.error('Failed to fetch timelines:', error);
      toast.error('获取Timelock列表失败');
    } finally {
      setIsLoadingTimelocks(false);
    }
  }, [getTimelockList]);

  // Fetch timelock list when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTimelocks();
    }
  }, [isOpen, fetchTimelocks]);

  const handleVerificationCodeChange = async (code: string) => {
    setVerificationCode(code);
    
    // Auto-verify when code is complete (assuming 6 digits)
    if (code.length === 6 && emailAddress) {
      try {
        await verifyEmail({
          email: emailAddress,
          verification_code: code,
        });
        setIsEmailVerified(true);
        toast.success('邮箱验证成功！');
      } catch (error) {
        console.error('Email verification failed:', error);
        setIsEmailVerified(false);
        toast.error(`邮箱验证失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    } else {
      setIsEmailVerified(false);
    }
  };

  const handlePermissionChange = (id: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, id] : prev.filter((permId) => permId !== id)
    );
  };

  const handleSendCode = async () => {
    if (!emailAddress) {
      toast.error('请先输入邮箱地址！');
      return;
    }

    try {
      await resendVerificationCode({ email: emailAddress });
      toast.success('验证码已发送到您的邮箱！');
      // Reset verification status when new code is sent
      setIsEmailVerified(false);
    } catch (error) {
      console.error('Failed to send verification code:', error);
      toast.error(`发送验证码失败: ${error instanceof Error ? error.message : '未知错误'}`);
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

    if (!isEmailVerified) {
      toast.error('请先验证邮箱地址！');
      return;
    }

    try {
      // Only create email notification if email is verified
      await createEmailNotification({
        email: emailAddress,
        email_remark: emailRemark,
        timelock_contracts: selectedPermissions,
      });

      toast.success('邮箱地址添加成功！');
      onSuccess();
      onClose();
      // Reset form state
      setEmailAddress('');
      setEmailRemark('');
      setSelectedPermissions([]);
      setVerificationCode('');
      setIsEmailVerified(false);
    } catch (error) {
      console.error('Failed to add mailbox:', error);
      toast.error(`添加邮箱地址失败: ${error instanceof Error ? error.message : '未知错误'}`);
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
        {isLoadingTimelocks ? (
          <div className="py-4 text-center text-gray-500">加载Timelock列表中...</div>
        ) : (
          <ListeningPermissions
            permissions={permissions}
            selectedPermissions={selectedPermissions}
            onPermissionChange={handlePermissionChange}
          />
        )}

        {/* Verification Code Input Section */}
        <VerificationCodeInput
          email={emailAddress}
          onSendCode={handleSendCode}
          onCodeChange={handleVerificationCodeChange}
          codeLength={6}
        />
        
        {/* Verification Status Indicator */}
        {verificationCode.length === 6 && (
          <div className={`mb-4 p-3 rounded-md ${isEmailVerified ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isEmailVerified ? (
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                邮箱验证成功
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-red-500 mr-2">✗</span>
                验证码错误，请重新输入
              </div>
            )}
          </div>
        )}

        </div>
       
        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-auto p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            取消 {/* Updated to Chinese */}
          </button>
          <button
            type="button"
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