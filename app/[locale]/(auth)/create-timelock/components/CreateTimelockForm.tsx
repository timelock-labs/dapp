// components/timelock-creation/CreateTimelockForm.tsx
import React, { useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Adjust path
import SelectInput from '@/components/ui/SelectInput';     // Adjust path
import TextInput from '@/components/ui/TextInput';         // Adjust path
import { Button } from '@/components/ui/button';
import ContractStandardSelection from './ContractStandardSelection'; // Adjust path
import { useAuthStore } from '@/store/userStore';

interface CreateTimelockFormProps {
  selectedChain: string;
  onChainChange: (value: string) => void;
  selectedStandard: string;
  onStandardChange: (value: string) => void;
  minDelay: string;
  onMinDelayChange: (value: string) => void;
  proposers: string;
  onProposersChange: (value: string) => void;
  executors: string;
  onExecutorsChange: (value: string) => void;
  admin: string;
  onAdminChange: (value: string) => void;
  onDeploy: () => void;
  isLoading: boolean;
}

const CreateTimelockForm: React.FC<CreateTimelockFormProps> = ({
  selectedChain, onChainChange, selectedStandard, onStandardChange, minDelay, onMinDelayChange,
  proposers, onProposersChange, executors, onExecutorsChange, admin, onAdminChange,
  onDeploy, isLoading
}) => {
  const { chains, fetchChains } = useAuthStore();

  useEffect(() => {
    if (chains.length === 0) {
      fetchChains();
    }
  }, [chains, fetchChains]);

  const chainOptions = chains.map(chain => ({
    value: chain.chain_id,
    label: chain.chain_name,
  }));

  return (
    <div className="bg-white p-6 rounded-lg  border-b border-gray-200">
      <SectionHeader
        title="创建Timelock"
        description="View and update your personal details and account information."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        {/* Select Chain */}
        <div className="md:col-start-2 min-w-[548px]">
          <SelectInput
            label="选择所在链"
            value={selectedChain}
            onChange={onChainChange}
            options={chainOptions}
            placeholder="选择所在链"
          />
        </div>

        {/* Contract Standard Selection */}
        <div className="md:col-start-2">
          <ContractStandardSelection
            selectedStandard={selectedStandard}
            onStandardChange={onStandardChange}
          />
        </div>

        {/* minDelay Input */}
        <div className="md:col-start-2 min-w-[548px]"> 
          <TextInput
            label="minDelay"
            value={minDelay}
            onChange={onMinDelayChange}
            placeholder="操作的初始最小延迟 (秒)"
            type="number" // Assuming delay is a number
          />
        </div>
        {selectedStandard === 'openzeppelin' && (
          <>
            <div className="md:col-start-2 min-w-[548px]">
              <TextInput
                label="Proposers"
                value={proposers}
                onChange={onProposersChange}
                placeholder="授予提议者和取消者角色的账户"
              />
            </div>
            <div className="md:col-start-2 min-w-[548px]">
              <TextInput
                label="Executors"
                value={executors}
                onChange={onExecutorsChange}
                placeholder="被授予执行者角色的账户"
              />
            </div>
            <div className="md:col-start-2 min-w-[548px]">
              <TextInput
                label="Admin"
                value={admin}
                onChange={onAdminChange}
                placeholder="授予管理员角色的可选帐户；使用零地址禁用"
              />
            </div>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onDeploy} disabled={isLoading}>
          {isLoading ? '部署中...' : '创建Timelock'}
        </Button>
      </div>
    </div>
  );
};

export default CreateTimelockForm;