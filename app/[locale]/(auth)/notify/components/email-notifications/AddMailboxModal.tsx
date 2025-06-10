"use client"
import React, { useState } from 'react';
import TextInput from '@/components/ui/TextInput'; // Assuming TextInput is in components/ui/

interface AddMailboxModalProps {
  isOpen: boolean; // Controls if the modal is visible
  onClose: () => void; // Callback to close the modal
  onConfirm: (mailboxAddress: string, mailboxName: string) => void; // Callback on confirm
}

const AddMailboxModal: React.FC<AddMailboxModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [mailboxAddress, setMailboxAddress] = useState('');
  const [mailboxName, setMailboxName] = useState('');

  if (!isOpen) return null; // Don't render anything if the modal is not open

  const handleConfirmAdd = () => {
    // Basic validation: ensure fields are not empty before confirming
    if (mailboxAddress.trim() === '' || mailboxName.trim() === '') {
      alert('请填写邮箱地址和邮箱名称！'); // Please fill in mailbox address and name!
      return;
    }
    onConfirm(mailboxAddress, mailboxName); // Pass data back to parent
    // Reset form fields after confirming
    setMailboxAddress('');
    setMailboxName('');
  };

  const handleCancel = () => {
    onClose(); // Just close the modal
    // Optionally reset form fields on cancel
    setMailboxAddress('');
    setMailboxName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        {/* Close Button (X icon) - This modal *does* have an X button in its original image */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-light leading-none"
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">添加邮箱</h2>

        {/* Mailbox Address Input */}
        <TextInput
          label="邮箱地址"
          value={mailboxAddress}
          onChange={setMailboxAddress}
          placeholder="Target"
        />

        {/* Mailbox Name Input */}
        <TextInput
          label="邮箱名称"
          value={mailboxName}
          onChange={setMailboxName}
          placeholder="Target"
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancle
          </button>
          <button
            onClick={handleConfirmAdd}
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMailboxModal;