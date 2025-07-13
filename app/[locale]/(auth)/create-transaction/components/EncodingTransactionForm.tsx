import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import TargetABISection from './TargetABISection';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/userStore';
import { useApi } from '@/hooks/useApi';
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
  // Dynamic arguments
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  // Function to get timelock address from selected timelock
  onTimelockAddressChange: (address: string) => void;
  // Function to receive timelock details
  onTimelockDetailsChange?: (details: Record<string, unknown>) => void;
}

const EncodingTransactionForm: React.FC<EncodingTransactionFormProps> = ({
  timelockType, onTimelockTypeChange, timelockMethod, onTimelockMethodChange,
  target, onTargetChange, value, onValueChange,
  abiValue, onAbiChange, functionValue, onFunctionChange,
  timeValue, onTimeChange, argumentValues, onArgumentChange,
  description, onDescriptionChange, onTimelockAddressChange, onTimelockDetailsChange
}) => {
  const t = useTranslations('CreateTransaction');
  const { allTimelocks, accessToken } = useAuthStore();
  const { data: timelockDetailResponse, request: fetchTimelockDetail } = useApi();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Convert timelock list to options format
  const timelockOptions = useMemo(() => {
    if (!Array.isArray(allTimelocks)) {
      return [];
    }
    return allTimelocks.map(timelock => ({
      value: timelock.id.toString(),
      label: `${timelock.remark || 'Timelock'} (${timelock.contract_address?.slice(0, 6)}...${timelock.contract_address?.slice(-4)})`,
      address: timelock.contract_address,
    }));
  }, [allTimelocks]);

  // Handle timelock selection and update address
  const handleTimelockChange = async (value: string) => {
    onTimelockTypeChange(value);
    const selectedTimelock = timelockOptions.find(option => option.value === value);
    
    if (selectedTimelock) {
      onTimelockAddressChange(selectedTimelock.address);
      
      // Find the full timelock object to get standard
      const fullTimelock = allTimelocks.find(tl => tl.id.toString() === value);
      if (fullTimelock && fullTimelock.standard && accessToken) {
        setIsLoadingDetails(true);
        
        try {
          console.log(`Fetching timelock details for ${fullTimelock.standard}/${fullTimelock.id}`);
          
          await fetchTimelockDetail(`/api/v1/timelock/detail/${fullTimelock.standard}/${fullTimelock.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to fetch timelock details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    }
  };
  
  // Handle timelock detail response and generate method options
  React.useEffect(() => {
    if (timelockDetailResponse && timelockDetailResponse.success && onTimelockDetailsChange) {
      console.log('Timelock details received:', timelockDetailResponse.data);
      onTimelockDetailsChange(timelockDetailResponse.data);
    }
  }, [timelockDetailResponse, onTimelockDetailsChange]);

  // Generate timelock method options based on selected timelock's standard
  const timelockMethodOptions = React.useMemo(() => {
    if (!timelockType || !allTimelocks || allTimelocks.length === 0) {
      return [];
    }

    const selectedTimelock = allTimelocks.find(tl => tl.id.toString() === timelockType);
    if (!selectedTimelock || !selectedTimelock.standard) {
      return [];
    }

    if (selectedTimelock.standard === 'compound') {
      return [
        { value: 'queueTransaction', label: 'queueTransaction' },
        { value: 'executeTransaction', label: 'executeTransaction' },
        { value: 'cancelTransaction', label: 'cancelTransaction' },
        { value: 'setPendingAdmin', label: 'setPendingAdmin' },
        { value: 'acceptAdmin', label: 'acceptAdmin' },
        { value: 'setDelay', label: 'setDelay' },
      ];
    } else if (selectedTimelock.standard === 'openzeppelin') {
      return [
        { value: 'schedule', label: 'schedule' },
        { value: 'scheduleBatch', label: 'scheduleBatch' },
        { value: 'execute', label: 'execute' },
        { value: 'executeBatch', label: 'executeBatch' },
        { value: 'cancel', label: 'cancel' },
        { value: 'updateDelay', label: 'updateDelay' },
        { value: 'grantRole', label: 'grantRole' },
        { value: 'revokeRole', label: 'revokeRole' },
      ];
    }

    return [];
  }, [timelockType, allTimelocks]);

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
            placeholder={isLoadingDetails ? 'Loading timelock details...' : (allTimelocks.length === 0 ? 'No timelocks available' : 'Select Timelock')}
          />
          <SelectInput
            label={t('encodingTransaction.selectTimelockMethod')}
            value={timelockMethod}
            onChange={onTimelockMethodChange}
            options={timelockMethodOptions}
            placeholder={timelockType ? 'Select Timelock Method' : 'Select Timelock first'}
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
          argumentValues={argumentValues}
          onArgumentChange={onArgumentChange}
        />
      </div>
    </div>
  );
};

export default EncodingTransactionForm;