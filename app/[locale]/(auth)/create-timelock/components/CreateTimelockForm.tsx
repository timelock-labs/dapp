import React, { useEffect, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import { Button } from "@/components/ui/button";
import ContractStandardSelection from "./ContractStandardSelection";
import { useAuthStore } from "@/store/userStore";
import type { CreateTimelockFormProps, ChainOption } from "@/types";

const DEFAULT_CHAIN_LOGO = "/default-chain-logo.png";

/**
 * Create timelock form component with chain selection and contract standard options
 * 
 * @param props - CreateTimelockForm component props
 * @returns JSX.Element
 */
export const CreateTimelockForm: React.FC<CreateTimelockFormProps> = ({
  selectedChain,
  onChainChange,
  selectedStandard,
  onStandardChange,
  minDelay,
  onMinDelayChange,
  onDeploy,
  isLoading,
}) => {
  const t = useTranslations("CreateTimelock");
  const { chains, fetchChains } = useAuthStore();

  // Fetch chains on mount if not already loaded
  useEffect(() => {
    if (chains.length === 0) {
      fetchChains();
    }
  }, [chains.length, fetchChains]);

  // Memoize chain options to prevent unnecessary re-renders
  const chainOptions = useMemo<ChainOption[]>(
    () =>
      chains.map((chain) => ({
        value: chain.chain_id.toString(),
        label: chain.display_name,
        logo: chain.logo_url || DEFAULT_CHAIN_LOGO,
      })),
    [chains],
  );

  // Handle chain selection change
  const handleChainChange = useCallback(
    (value: string) => {
      onChainChange(Number(value));
    },
    [onChainChange],
  );

  // Format the selected chain value for the SelectInput
  const selectedChainValue = selectedChain.toString();



  // Handle number input changes
  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    return value;
  }, []);

  // Memoize selected chain logo
  const selectedChainLogo = useMemo(() => chainOptions.find((option) => option.value === selectedChainValue)?.logo, [chainOptions, selectedChainValue]);

  return (
    <div className="bg-white p-6 rounded-lg border-b border-gray-200">
      <SectionHeader title={t("createTimelock")} description={t("createTimelockDescription")} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6">
        {/* Select Chain */}
        <div className="md:col-start-2 min-w-[548px]">
          <SelectInput label={t("selectChain")} value={selectedChainValue} onChange={handleChainChange} options={chainOptions} logo={selectedChainLogo} placeholder={t("selectChainPlaceholder")} />
        </div>

        {/* Contract Standard Selection */}
        <div className="md:col-start-2">
          <ContractStandardSelection selectedStandard={selectedStandard} onStandardChange={onStandardChange} />
        </div>

        {/* minDelay Input */}
        <div className="md:col-start-2 min-w-[548px]">
          <TextInput label={t("minDelay")} value={minDelay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMinDelayChange(handleNumberChange(e))} placeholder={t("minDelayPlaceholder")} type="number" min="0" step="1" />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={onDeploy}
          disabled={isLoading}
          className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLoading ? t("deploying") : t("deployContract")}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t("deploying")}
            </span>
          ) : (
            t("deployContract")
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateTimelockForm;
