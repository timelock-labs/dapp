// components/timelock-creation/ContractStandardSelection.tsx
import React from 'react';
import RadioButtonOption from './RadioButtonOption'; // Adjust path

interface ContractStandardSelectionProps {
  selectedStandard: string;
  onStandardChange: (standard: string) => void;
}

const ContractStandardSelection: React.FC<ContractStandardSelectionProps> = ({
  selectedStandard,
  onStandardChange,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">选择合约标准</label>
      <div className="space-y-4"> {/* Vertical spacing between radio options */}
        <RadioButtonOption
          id="compound-standard"
          name="contractStandard"
          value="compound"
          label="该合约为 Compound 标准 Timelock 合约"
          description="Perfect for small businesses getting started with our platform"
          checked={selectedStandard === 'compound'}
          onChange={onStandardChange}
        />
        <RadioButtonOption
          id="openzeppelin-standard"
          name="contractStandard"
          value="openzeppelin"
          label="该合约为 Openzeppelin 标准 Timelock 合约"
          description="Advanced features for growing businesses with higher demands"
          checked={selectedStandard === 'openzeppelin'}
          onChange={onStandardChange}
        />
      </div>
    </div>
  );
};

export default ContractStandardSelection;