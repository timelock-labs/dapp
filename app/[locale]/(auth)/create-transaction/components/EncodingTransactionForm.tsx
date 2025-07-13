import Image from 'next/image';
import React, { useEffect, useMemo } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import TargetABISection from './TargetABISection';
import { useTranslations } from 'next-intl';
import { useTimelockApi } from '@/hooks/useTimelockApi';
import QuestionIcon from '@/public/QuestionIcon.svg';
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
  description: string;
  onDescriptionChange: (value: string) => void;
  // Function to get timelock address from selected timelock
  onTimelockAddressChange: (address: string) => void;
}

const EncodingTransactionForm: React.FC<EncodingTransactionFormProps> = ({
  timelockType, onTimelockTypeChange, timelockMethod, onTimelockMethodChange,
  target, onTargetChange, value, onValueChange,
  abiValue, onAbiChange, functionValue, onFunctionChange,
  timeValue, onTimeChange, arg1Value, onArg1Change, arg2Value, onArg2Change,
  description, onDescriptionChange, onTimelockAddressChange
}) => {
  const t = useTranslations('CreateTransaction');
  const { getTimelockList } = useTimelockApi();
  const [timelockList, setTimelockList] = React.useState<any[]>([]);
  const [isLoadingTimelocks, setIsLoadingTimelocks] = React.useState(false);

  // Fetch timelock list on component mount
  useEffect(() => {
    const fetchTimelocks = async () => {
      setIsLoadingTimelocks(true);
      try {
        const response = await getTimelockList();
        if (response.success && response.data) {
          setTimelockList(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch timelocks:', error);
      } finally {
        setIsLoadingTimelocks(false);
      }
    };

    fetchTimelocks();
  }, [getTimelockList]);

  // Convert timelock list to options format
  const timelockOptions = useMemo(() => {
    return timelockList.map(timelock => ({
      value: timelock.id || timelock.address,
      label: `${timelock.remark || timelock.name || 'Timelock'} (${timelock.address?.slice(0, 6)}...${timelock.address?.slice(-4)})`,
      address: timelock.address,
    }));
  }, [timelockList]);

  // Handle timelock selection and update address
  const handleTimelockChange = (value: string) => {
    onTimelockTypeChange(value);
    const selectedTimelock = timelockOptions.find(option => option.value === value);
    if (selectedTimelock) {
      onTimelockAddressChange(selectedTimelock.address);
    }
  };
  const timelockMethodOptions = [
    { value: 'methodA', label: 'Method A' },
    { value: 'methodB', label: 'Method B' },
  ];

  return (
    // Use a grid layout for left (header) and right (form content) sections
    <div className="bg-white py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-300">
      {/* Left Column: Section Header */}
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title={t('encodingTransaction.title')}
          description={t('encodingTransaction.description')}
          icon={<Image src={QuestionIcon} alt="Question Icon" width={15} height={15} />}
        />
      </div>

      {/* Right Column: Form Elements */}
      <div className="lg:col-span-1 flex flex-col space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            label={t('encodingTransaction.selectTimelock')}
            value={timelockType}
            onChange={handleTimelockChange}
            options={timelockOptions}
            placeholder={isLoadingTimelocks ? 'Loading timelocks...' : 'Select Timelock'}
          />
          <SelectInput
            label={t('encodingTransaction.selectTimelockMethod')}
            value={timelockMethod}
            onChange={onTimelockMethodChange}
            options={timelockMethodOptions}
            placeholder="Timelock Method"
          />
        </div>

        <TextInput
          label={t('encodingTransaction.target')}
          value={target}
          onChange={onTargetChange}
          placeholder="Target"
        />
        <TextInput
          label={t('encodingTransaction.value')}
          value={value}
          onChange={onValueChange}
          placeholder="Value"
        />
        <TextInput
          label={t('encodingTransaction.formDescription')}
          value={description}
          onChange={onDescriptionChange}
          placeholder={t('encodingTransaction.descriptionPlaceholder')}
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