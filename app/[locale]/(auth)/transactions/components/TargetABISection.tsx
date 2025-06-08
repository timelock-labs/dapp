import React, { useState } from 'react'; // Import useState
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import AddABIForm from './AddABIForm'; // Import the new form component

interface TargetABISectionProps {
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

const TargetABISection: React.FC<TargetABISectionProps> = ({
  abiValue, onAbiChange, functionValue, onFunctionChange,
  timeValue, onTimeChange, arg1Value, onArg1Change, arg2Value, onArg2Change
}) => {
  const [isAddABIOpen, setIsAddABIOpen] = useState(false);
  const abiOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ];
  const functionOptions = [
    { value: 'value', label: 'Value' }, // Based on image
    { value: 'functionA', label: 'Function A' },
    { value: 'functionB', label: 'Function B' },
  ];

  const handleAddABI = (name: string, abi: string) => {
    console.log('New ABI Added:', { name, abi });
    // Here you would typically update your abiOptions state or call an API
  };

  return (
    <div className="rounded-md mb-4">
      <div className="flex items-end space-x-4 mb-4">
        <div className="flex-grow">
          <SelectInput
            label="Target ABI"
            value={abiValue}
            onChange={onAbiChange}
            options={abiOptions}
            placeholder="Select ABI"
          />
        </div>
        <button
          onClick={() => setIsAddABIOpen(true)} // Open dialog on click
          className="bg-neutral-100 text-neutral-900 rounded-md hover:bg-neutral-200 transition-colors text-xl font-bold w-[88px] h-9 pt-2 pr-4 pb-2 pl-4 flex items-center justify-center transform -translate-y-4"
        >
          +
        </button>
      </div>

      {/* Function and Arguments Row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          label="Function"
          value={functionValue}
          onChange={onFunctionChange}
          options={functionOptions}
          placeholder="Select Function"
        />
        <TextInput
          label="Time"
          value={timeValue}
          onChange={onTimeChange}
          placeholder="Value"
        />
        <TextInput
          label="arg1"
          value={arg1Value}
          onChange={onArg1Change}
          placeholder="Value"
        />
        <TextInput
          label="arg2"
          value={arg2Value}
          onChange={onArg2Change}
          placeholder="Value"
        />
      </div>

      <AddABIForm
        isOpen={isAddABIOpen}
        onClose={() => setIsAddABIOpen(false)}
        onAddABI={handleAddABI}
      />
    </div>
  );
};

export default TargetABISection;