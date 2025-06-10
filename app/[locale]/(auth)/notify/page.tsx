"use client"
import React, { useState } from 'react';
import EmailRulesHeader from './components/email-notifications/EmailRulesHeader';
import MailboxCard from './components/email-notifications/MailboxCard';
import AddMailboxCard from './components/email-notifications/AddMailboxCard';
import AddMailboxModal from "./components/email-address/AddMailboxModal"
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

interface Mailbox {
  id: string;
  name: string;
  email: string;
}

const EmailNotificationPage: React.FC = () => {
    const  t  = useTranslations('Notify');
  // Dummy data for mailboxes
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([
    { id: 'm1', name: 'Uniswap 安全部门', email: 'kaso@foxmail.com' },
    { id: 'm2', name: 'Uniswap 安全部门', email: 'kaso@foxmail.com' },
    { id: 'm3', name: 'Uniswap 安全部门', email: 'kaso@foxmail.com' },
    { id: 'm4', name: 'Uniswap 安全部门', email: 'kaso@foxmail.com' },
  ]);

  const [isAddMailboxModalOpen, setIsAddMailboxModalOpen] = useState(false);

  const handleDeleteMailbox = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mailbox?')) {
      setMailboxes(mailboxes.filter((mb) => mb.id !== id));
      console.log(`Deleted mailbox with ID: ${id}`);
    }
  };

  const handleAddMailbox = (address: string, name: string) => {
    const newMailbox: Mailbox = {
      id: `m${mailboxes.length + 1}`, // Simple ID generation
      name: name,
      email: address,
    };
    setMailboxes([...mailboxes, newMailbox]);
    console.log('Added new mailbox:', newMailbox);
    setIsAddMailboxModalOpen(false); // Close modal
  };

  return (
    <PageLayout title={t('title')}>
         <div className=" p-8">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8">
        {/* Email Rules Header */}
        <EmailRulesHeader />

        {/* Mailbox Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mailboxes.map((mailbox) => (
            <MailboxCard
              key={mailbox.id}
              id={mailbox.id}
              name={mailbox.name}
              email={mailbox.email}
              onDelete={handleDeleteMailbox}
            />
          ))}
          {/* Add Mailbox Card */}
          <AddMailboxCard onClick={() => setIsAddMailboxModalOpen(true)} />
        </div>
      </div>

      {/* Add Mailbox Modal (Conditional Rendering) */}
      <AddMailboxModal
        isOpen={isAddMailboxModalOpen}
        onClose={() => setIsAddMailboxModalOpen(false)}
        onConfirm={handleAddMailbox}
      />
    </div>
    </PageLayout>
   
  );
};

export default EmailNotificationPage;