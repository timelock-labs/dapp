import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectInput from '@/components/ui/SelectInput';

interface MailboxSelectionProps {
  selectedMailbox: string;
  onMailboxChange: (value: string) => void;
}

const MailboxSelection: React.FC<MailboxSelectionProps> = ({ selectedMailbox, onMailboxChange }) => {
  const mailboxOptions = [
    { value: 'mailbox1', label: '邮箱1' },
    { value: 'mailbox2', label: '邮箱2' },
  ];

  return (
    // Use a grid layout for left (header) and right (select input) sections
    <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-300">
      {/* Left Column: Section Header */}
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title="监听的邮箱" // This title is currently hardcoded.
          description="View and update your personal details and account information." // This description is currently hardcoded.
        />
      </div>

      {/* Right Column: Select Input */}
      <div className="lg:col-span-1">
        <SelectInput
          label="选择已配置的邮箱"
          value={selectedMailbox}
          onChange={onMailboxChange}
          options={mailboxOptions}
          placeholder="选择已配置的邮箱"
        />
      </div>
    </div>
  );
};

export default MailboxSelection;