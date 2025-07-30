import Image from 'next/image';
import React, { useMemo, useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import SelectInput from '@/components/ui/SelectInput';
import TextInput from '@/components/ui/TextInput';
import TargetABISection from './TargetABISection';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/userStore';
import { useApi } from '@/hooks/useApi';
import QuestionIcon from '@/public/QuestionIcon.svg';
import { useChainId, useSwitchChain } from '@thirdweb-dev/react';

interface EncodingTransactionFormProps {
  timelockType: string;
  onTimelockTypeChange: (value: string) => void;
  timelockMethod: string;
  onTimelockMethodChange: (value: string) => void;
  target: string;
  onTargetChange: (value: string) => void;
  value: string;
  onValueChange: (value: string) => void;
  abiValue: string;
  onAbiChange: (value: string) => void;
  functionValue: string;
  onFunctionChange: (value: string) => void;
  timeValue: string;
  onTimeChange: (value: string) => void;
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onTimelockAddressChange: (address: string) => void;
  onTimelockDetailsChange?: (details: Record<string, unknown>) => void;
}

const EncodingTransactionForm: React.FC<EncodingTransactionFormProps> = ({
  timelockType,
  onTimelockTypeChange,
  timelockMethod,
  onTimelockMethodChange,
  target,
  onTargetChange,
  value,
  onValueChange,
  abiValue,
  onAbiChange,
  functionValue,
  onFunctionChange,
  timeValue,
  onTimeChange,
  argumentValues,
  onArgumentChange,
  description,
  onDescriptionChange,
  onTimelockAddressChange,
  onTimelockDetailsChange,
}) => {
  const t = useTranslations('CreateTransaction');
  const { allTimelocks, accessToken } = useAuthStore();
  const { data: timelockDetailResponse, request: fetchTimelockDetail } = useApi();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ target?: string; value?: string }>({});
  const [currentTimelockDetails, setCurrentTimelockDetails] = useState<Record<string, unknown> | null>(null);

  const chainId = useChainId();
  const switchChain = useSwitchChain();

  const validateTarget = (target: string) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      return 'Invalid Ethereum address';
    }
    return undefined;
  };

  const validateValue = (value: string) => {
    try {
      BigInt(value);
      return undefined;
    } catch {
      return 'Invalid bigint value';
    }
  };

  const handleTargetChange = (newValue: string) => {
    onTargetChange(newValue);
    const error = validateTarget(newValue);
    setValidationErrors(prev => ({ ...prev, target: error }));
  };

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    const error = validateValue(newValue);
    setValidationErrors(prev => ({ ...prev, value: error }));
  };

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

  const handleTimelockChange = async (value: string) => {


    onTimelockTypeChange(value);
    const selectedTimelock = timelockOptions.find(option => option.value === value);
    alert(`Selected Timelock: ${JSON.stringify(selectedTimelock)}`);
    if (selectedTimelock) {
      onTimelockAddressChange(selectedTimelock.address);

      const fullTimelock = allTimelocks.find(tl => tl.id.toString() === value);
      if (fullTimelock && fullTimelock.standard && accessToken) {
        setIsLoadingDetails(true);

        try {

          const timelocks = await fetchTimelockDetail(`/api/v1/timelock/detail/${fullTimelock.standard}/${fullTimelock.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          // setCurrentTimelockDetails(timelocks.data);

          setCurrentTimelockDetails({
            chain_id: 97
          });

          alert(`Fetched Timelock Details: ${JSON.stringify(timelocks)}`);

        } catch (error) {
          console.error('Failed to fetch timelock details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    }
  };

  useEffect(() => {
    if (timelockDetailResponse && timelockDetailResponse.success && onTimelockDetailsChange) {
      onTimelockDetailsChange(timelockDetailResponse.data);
    }
  }, [timelockDetailResponse, onTimelockDetailsChange]);

  useEffect(() => {
    if (currentTimelockDetails?.chain_id) handleTimelockMethodChange()
  }, [JSON.stringify(currentTimelockDetails)]);

  const handleTimelockMethodChange = () => {

    if (currentTimelockDetails.chain_id !== chainId) {
      switchChain(parseInt(currentTimelockDetails.chain_id))
        .then(() => {
          console.log('Switched to chain:', currentTimelockDetails.chain_id);
        })
        .catch(error => {
          console.error('Failed to switch chain:', error);
        });
    }

  }

  const timelockMethodOptions = useMemo(() => {
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

  useEffect(() => {
    if (
      currentTimelockDetails?.chain_id &&
      parseInt(currentTimelockDetails.chain_id as string) !== chainId
    ) {
      handleTimelockChange('');
      handleTimelockMethodChange();
    }
  }, [currentTimelockDetails, chainId]);


  return (
    <div className="bg-white py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start border-b border-gray-300">
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title={t('encodingTransaction.title')}
          description={t('encodingTransaction.description')}
          icon={<Image src={QuestionIcon} alt="Question Icon" width={15} height={15} />}
        />
      </div>
      {JSON.stringify(currentTimelockDetails)}

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
          onChange={handleTargetChange}
          placeholder="Target"
          error={validationErrors.target}
        />
        <TextInput
          label={t('encodingTransaction.value')}
          value={value}
          onChange={handleValueChange}
          placeholder="Value"
          error={validationErrors.value}
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
