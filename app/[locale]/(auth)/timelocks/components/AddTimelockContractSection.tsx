// components/AddTimelockContractSection.tsx
"use client"
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming SectionHeader is in components/ui/
import TimelockOptionCard from './TimelockOptionCard'; // Assuming TimelockOptionCard is in components/

const AddTimelockContractSection: React.FC = () => {
  const handleCreateContract = () => {
    console.log('Create Timelock Contract option clicked');
    // Here you would navigate to a page or open a modal for creating a contract
  };

  const handleImportContract = () => {
    console.log('Import existing Timelock Contract option clicked');
    // Here you would navigate to a page or open a modal for importing a contract
  };

  return (
    <div className="p-8 bg-white min-h-screen"> {/* Wrapper with a light gray background */}
      <div className="max-w-6xl mx-auto"> {/* Max width container to center content */}
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