// components/timelock-creation/CreateTimelockForm.tsx
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import SelectInput from '@/components/ui/SelectInput';     // Adjust path
import TextInput from '@/components/ui/TextInput';         // Adjust path
import ContractStandardSelection from './ContractStandardSelection'; // Adjust path

interface CreateTimelockFormProps {
  selectedChain: string;
  onChainChange: (value: string) => void;
  selectedStandard: string;
  onStandardChange: (value: string) => void;
  minDelay: string;
  onMinDelayChange: (value: string) => void;
}

const CreateTimelockForm: React.FC<CreateTimelockFormProps> = ({
  selectedChain, onChainChange, selectedStandard, onStandardChange, minDelay, onMinDelayChange
}) => {
  const chainOptions = [
    { value: 'timelock', label: 'Timelock' }, // As in image
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'bsc', label: 'BNB Smart Chain' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg  border-b border-gray-200">
      <SectionHeader
        title="创建Timelock"
        description="View and update your personal details and account information."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        {/* Left Column for overall layout, right column for form fields */}
        {/* Select Chain */}
        <div className="md:col-start-2 min-w-[548px]"> {/* This field is in the right column of the internal grid */}
          <SelectInput
            label="选择所在链"
            value={selectedChain}
            onChange={onChainChange}
            options={chainOptions}
            placeholder="Timelock"
          />
        </div>

        {/* Contract Standard Selection */}
        <div className="md:col-start-2"> {/* This field is in the right column of the internal grid */}
          <ContractStandardSelection
            selectedStandard={selectedStandard}
            onStandardChange={onStandardChange}
          />
        </div>

        {/* minDelay Input */}
        <div className="md:col-start-2 min-w-[548px]"> {/* This field is in the right column of the internal grid */}
          <TextInput
            label="minDelay"
            value={minDelay}
            onChange={onMinDelayChange}
            placeholder="操作的初始最小延迟 (秒)"
            type="number" // Assuming delay is a number
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTimelockForm;