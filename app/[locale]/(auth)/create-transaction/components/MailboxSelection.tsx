import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';
import { useNotificationApi, EmailNotification } from '@/hooks/useNotificationApi';

interface MailboxSelectionProps {
  selectedMailbox: string[];
  onMailboxChange: (value: string[]) => void;
}

const MailboxSelection: React.FC<MailboxSelectionProps> = ({ selectedMailbox, onMailboxChange }) => {
  const t = useTranslations('CreateTransaction');
  const { getEmailNotifications } = useNotificationApi();
  const [mailboxOptions, setMailboxOptions] = useState<EmailNotification[]>([]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await getEmailNotifications({ page: 1, page_size: 100 });
        setMailboxOptions(response.items);
      } catch (error) {
        console.error('Failed to fetch email notifications:', error);
      }
    };

    fetchEmails();
  }, [getEmailNotifications]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      onMailboxChange([...selectedMailbox, value]);
    } else {
      onMailboxChange(selectedMailbox.filter((item) => item !== value));
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
                key={option.id}
                className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors bg-[#F5F5F5] h-8"
              >
                <Checkbox
                  id={String(option.id)}
                  checked={selectedMailbox.includes(option.email)}
                  onCheckedChange={(checked) => handleCheckboxChange(option.email, checked as boolean)}
                />
                <label
                  htmlFor={String(option.id)}
                  className="text-sm text-gray-700 cursor-pointer flex-1"
                >
                  {option.email_remark || option.email}
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