// components/AddTimelockContractSection.tsx
"use client"
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming SectionHeader is in components/ui/
import TimelockOptionCard from './TimelockOptionCard'; // Assuming TimelockOptionCard is in components/
import { useRouter, useParams } from 'next/navigation';

const AddTimelockContractSection: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const handleCreateContract = () => {
    router.push(`/${locale}/create-timelock`);
  };

  const handleImportContract = () => {
    router.push(`/${locale}/import-timelock`);
  };

  return (
    <div className="bg-white "> {/* Wrapper with a light gray background */}
      <div className="mx-auto"> {/* Max width container to center content */}
        {/* Section Header */}
        <SectionHeader
          title="添加Timelock 合约"
          description="Manage or upgrade your plan."
        />

        {/* Two option cards in a responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Black Card: Create Timelock Contract */}
          <TimelockOptionCard
            title="创建 Timelock 合约"
            description="This is a card description."
            bgColor="bg-black"
            textColor="text-white"
            onClick={handleCreateContract}
          />

          {/* White Card: Import existing Timelock Contract */}
          <TimelockOptionCard
            title="导入现有 Timelock 合约"
            description="This is a card description."
            bgColor="bg-white"
            textColor="text-gray-900"
            borderColor="border-gray-200" // Explicit border for visibility on white background
            onClick={handleImportContract}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTimelockContractSection;