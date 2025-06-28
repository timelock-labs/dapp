import React from 'react';
import {useLocale, useTranslations} from 'next-intl';
import PageLayout from '@/components/layout/PageLayout';
import WalletSection from './WalletSection';
import HowTimelockWorks from './HowTimelockWorks';
import FeatureCard from '@/components/ui/FeatureCard';

const NotLogIn
: React.FC = () => {
  const t = useTranslations('HomePage');

  return (
    <PageLayout title={t('title')} >
       <div className=" bg-gray-50 pb-20">
      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12">
        {/* First Row Component */}
        <div className="mb-12">
          <WalletSection />
        </div>
        {/* Second Row: How Timelock Works & How to Use Protocol */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          <HowTimelockWorks />
        </div>
        {/* Third Row: Who is using it? and Feature Cards */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            谁在使用? <span className="text-gray-500 text-base font-normal">Manage or upgrade your plan.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Title Text" description="This is a card description." icon="⚙️" />
            <FeatureCard title="Title Text" description="This is a card description." icon="🔒" />
            <FeatureCard title="Title Text" description="This is a card description." icon="📈" />
            <FeatureCard title="Title Text" description="This is a card description." icon="🔵" />
            <FeatureCard title="Title Text" description="This is a card description." icon="⚡" />
            <FeatureCard title="Title Text" description="This is a card description." icon="💶" />
          </div>
        </div>
      </main>
    </div>
    </PageLayout>
  );
};

export default NotLogIn
;