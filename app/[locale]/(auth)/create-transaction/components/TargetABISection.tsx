import React, { useState, useEffect, useMemo } from 'react';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import AddABIForm from './AddABIForm';
import { useTranslations } from 'next-intl';
import { useAbiApi } from '@/hooks/useAbiApi';
import { toast } from 'sonner';

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
  const t = useTranslations('CreateTransaction');
  const [isAddABIOpen, setIsAddABIOpen] = useState(false);
  const { abiList, isLoading, fetchAbiList, addAbi } = useAbiApi();

  // Convert ABI list to options format
  const abiOptions = useMemo(() => {
    return abiList.map(abi => ({
      value: abi.id.toString(),
      label: abi.name,
    }));
  }, [abiList]);

  // Parse functions from selected ABI
  const functionOptions = useMemo(() => {
    if (!abiValue) return [];
    
    const selectedAbi = abiList.find(abi => abi.id.toString() === abiValue);
    if (!selectedAbi) return [];

    try {
      const abiContent = JSON.parse(selectedAbi.abi_content);
      return abiContent
        .filter((item: any) => item.type === 'function')
        .map((func: any) => ({
          value: func.name,
          label: func.name,
        }));
    } catch (error) {
      console.error('Error parsing ABI content:', error);
      return [];
    }
  }, [abiValue, abiList]);

  const handleAddABI = async (name: string, abi: string) => {
    try {
      await addAbi(name, '', abi);
      toast.success('ABI added successfully!');
      setIsAddABIOpen(false);
    } catch (error: any) {
      console.error('Failed to add ABI:', error);
      toast.error(error.message || 'Failed to add ABI');
    }
  };

  return (
    <div className="rounded-md mb-4">
      <div className="flex items-end space-x-4 mb-4">
        <div className="flex-grow">
          <SelectInput
            label={t('targetABI.label')}
            value={abiValue}
            onChange={onAbiChange}
            options={abiOptions}
            placeholder={isLoading ? 'Loading ABIs...' : t('targetABI.placeholder')}
          />
        </div>
        <button
          type="button"
          onClick={() => setIsAddABIOpen(true)}
          className="bg-neutral-100 text-neutral-900 rounded-md hover:bg-neutral-200 transition-colors text-xl font-bold w-[88px] h-9 pt-2 pr-4 pb-2 pl-4 flex items-center justify-center transform -translate-y-4"
        >
          +
        </button>
      </div>

      {/* Function and Arguments Row */}
      <div className="grid grid-cols-2 gap-4">
        <SelectInput
          label={t('targetABI.function')}
          value={functionValue}
          onChange={onFunctionChange}
          options={functionOptions}
          placeholder={t('targetABI.selectFunction')}
        />
        <TextInput
          label={t('targetABI.time')}
          value={timeValue}
          onChange={onTimeChange}
          placeholder="Value"
        />
        <TextInput
          label={t('targetABI.arg1')}
          value={arg1Value}
          onChange={onArg1Change}
          placeholder="Value"
        />
        <TextInput
          label={t('targetABI.arg2')}
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