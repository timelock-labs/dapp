import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import TargetABISection from './TargetABISection';
import QuestionIcon from '@/public/QuestionIcon.svg'
interface EncodingTransactionFormProps {
  timelockType: string;
  onTimelockTypeChange: (value: string) => void;
  timelockMethod: string;
  onTimelockMethodChange: (value: string) => void;
  target: string;
  onTargetChange: (value: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  // Props for TargetABISection
  abiValue: string;
  onAbiChange: (value: string) => void;
  functionValue: string;
  onFunctionChange: (value: string) => void;
  timeValue: string;
  onTimeChange: (value: string) => void;
  arg1Value: string;
  onArg1Change: (value: string) => void;
  arg2Value: string;
  onArg2Change: (value: string) => void;
}

const EncodingTransactionForm: React.FC<EncodingTransactionFormProps> = ({
  timelockType, onTimelockTypeChange, timelockMethod, onTimelockMethodChange,
  target, onTargetChange, value, onValueChange,
  abiValue, onAbiChange, functionValue, onFunctionChange,
  timeValue, onTimeChange, arg1Value, onArg1Change, arg2Value, onArg2Change
}) => {
  const timelockOptions = [
    { value: 'timelockA', label: 'Timelock A' },
    { value: 'timelockB', label: 'Timelock B' },
  ];
  const timelockMethodOptions = [
    { value: 'methodA', label: 'Method A' },
    { value: 'methodB', label: 'Method B' },
  ];

  return (
    // Use a grid layout for left (header) and right (form content) sections
    <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-300">
      {/* Left Column: Section Header */}
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title="编码交易" // This title is currently hardcoded.
          description="View and update your personal details and account information." // This description is currently hardcoded.
          icon={<img src={QuestionIcon.src} alt="Question Icon" width="15" height="15" />}
        />
      </div>

      {/* Right Column: Form Elements */}
      <div className="lg:col-span-1 flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label="选择Timelock"
            value={timelockType}
            onChange={onTimelockTypeChange}
            options={timelockOptions}
            placeholder="Timelock"
          />
          <SelectInput
            label="选择Timelock方法"
            value={timelockMethod}
            onChange={onTimelockMethodChange}
            options={timelockMethodOptions}
            placeholder="Timelock"
          />
        </div>

        <TextInput
          label="Target"
          value={target}
          onChange={onTargetChange}
          placeholder="Target"
        />
        <TextInput
          label="Value"
          value={value}
          onChange={onValueChange}
          placeholder="Value"
        />

        <TargetABISection
          abiValue={abiValue}
          onAbiChange={onAbiChange}
          functionValue={functionValue}
          onFunctionChange={onFunctionChange}
          timeValue={timeValue}
          onTimeChange={onTimeChange}
          arg1Value={arg1Value}
          onArg1Change={onArg1Change}
          arg2Value={arg2Value}
          onArg2Change={onArg2Change}
        />
      </div>
    </div>
  );
};

export default EncodingTransactionForm;