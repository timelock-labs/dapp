import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

interface MailboxSelectionProps {
  selectedMailbox: string[];
  onMailboxChange: (value: string[]) => void;
}

const MailboxSelection: React.FC<MailboxSelectionProps> = ({ selectedMailbox, onMailboxChange }) => {
  const t = useTranslations('CreateTransaction');
  const mailboxOptions = [
    { value: 'mailbox1', label: t('mailbox.option1') },
    { value: 'mailbox2', label: t('mailbox.option2') },
    { value: 'mailbox3', label: 'Mailbox 3 Mailbox 3 Mailbox 3@gmail.com' },
    { value: 'mailbox4', label: 'Mailbox 4@example.com' },
  ];

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onMailboxChange([...selectedMailbox, value]);
    } else {
      onMailboxChange(selectedMailbox.filter(item => item !== value));
    }
  };

  return (
    // Use a grid layout for left (header) and right (checkbox) sections
    <div className="bg-white py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-300">
      {/* Left Column: Section Header */}
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title={t('mailbox.title')}
          description={t('mailbox.description')}
        />
      </div>

      {/* Right Column: Checkbox Options */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('mailbox.selectLabel')}
          </label>
          <div className="flex flex-wrap gap-2">
            {mailboxOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors bg-[#F5F5F5] h-8"
              >
              <Checkbox
                id={option.value}
                checked={selectedMailbox.includes(option.value)}
                onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
              />
              <label
                htmlFor={option.value}
                className="text-sm text-gray-700 cursor-pointer flex-1"
              >
                {option.label}
              </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailboxSelection;