import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import TargetABISection from "./TargetABISection";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/userStore";
import { useApi } from "@/hooks/useApi";
import QuestionIcon from "@/public/QuestionIcon.svg";
import { useActiveWalletChain, useSwitchActiveWalletChain } from "thirdweb/react";
import TimelockCompundABI from "@/components/abi/TimelockCompound.json";
import type { EncodingTransactionFormProps } from "./types";
import { getChainObject } from "@/utils/chainUtils";
import TextAreaInput from "@/components/ui/TextAreaInput";

const EncodingTransactionForm: React.FC<EncodingTransactionFormProps> = ({
  targetCalldata,
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
  const t = useTranslations("CreateTransaction");
  const { allTimelocks, accessToken } = useAuthStore();
  const { data: timelockDetailResponse, request: fetchTimelockDetail } = useApi();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ target?: string; value?: string }>({});
  const [currentTimelockDetails, setCurrentTimelockDetails] = useState<Record<string, unknown> | null>(null);

  const { id: chainId } = useActiveWalletChain() || {};
  const switchChain = useSwitchActiveWalletChain();

  const validateTarget = (target: string) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(target)) {
      return "Invalid Ethereum address";
    }
    return undefined;
  };

  const validateValue = (value: string) => {
    try {
      BigInt(value);
      return undefined;
    } catch {
      return "Invalid bigint value";
    }
  };

  const handleTargetChange = (newValue: string) => {
    onTargetChange(newValue);
    const error = validateTarget(newValue);
    setValidationErrors((prev) => ({ ...prev, target: error }));
  };

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    const error = validateValue(newValue);
    setValidationErrors((prev) => ({ ...prev, value: error }));
  };

  const timelockOptions = useMemo(() => {
    if (!Array.isArray(allTimelocks)) {
      return [];
    }
    return allTimelocks.map((timelock) => ({
      value: String(timelock.id),
      label: `${timelock.remark || "Timelock"} (${timelock.contract_address?.slice(0, 6)}...${timelock.contract_address?.slice(-4)})`,
      address: timelock.contract_address ?? "",
    }));
  }, [allTimelocks]);

  const handleTimelockChange = async (value: string) => {
    onTimelockTypeChange(value);
    const selectedTimelock = timelockOptions.find((option) => option.value === value);
    alert(`Selected Timelock: ${JSON.stringify(selectedTimelock)}`);
    if (selectedTimelock) {
      onTimelockAddressChange(selectedTimelock.address);

      const fullTimelock = allTimelocks.find((tl) => tl.id.toString() === value);
      if (fullTimelock && fullTimelock.standard && accessToken) {
        setIsLoadingDetails(true);

        try {
          const timelocks = await fetchTimelockDetail(`/api/v1/timelock/detail/${fullTimelock.standard}/${fullTimelock.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });

          // setCurrentTimelockDetails(timelocks.data);


          alert(`Fetched Timelock Details: ${JSON.stringify(timelocks)}`);
        } catch (error) {
          console.error("Failed to fetch timelock details:", error);
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
    if (currentTimelockDetails?.chain_id) handleTimelockMethodChange();
  }, [JSON.stringify(currentTimelockDetails)]);

  const handleTimelockMethodChange = () => {
    // 修复 currentTimelockDetails 可能为 null 的问题
    if (currentTimelockDetails && currentTimelockDetails.chain_id && Number(currentTimelockDetails.chain_id) !== chainId) {
      alert(`Switching chain to: ${currentTimelockDetails.chain_id}`);

      const chainObject = getChainObject(Number(currentTimelockDetails.chain_id));
      switchChain(chainObject)
        .then(() => {
          console.log("Switched to chain:", currentTimelockDetails.chain_id);
        })
    }
  };

  const timelockMethodOptions = useMemo(() => {
    if (!timelockType || !allTimelocks || allTimelocks.length === 0) {
      return [];
    }

    const selectedTimelock = allTimelocks.find((tl) => tl.id.toString() === timelockType);

    if (!selectedTimelock || !selectedTimelock.standard) {
      return [];
    }

    if (selectedTimelock.standard === "compound") {
      // 从 ABI 读取所有 function 名称作为 options
      const functions = TimelockCompundABI.filter((item) => item.type === "function" && item.stateMutability !== "view" && item.stateMutability !== "pure");
      return functions.map((fn) => {
        const inputTypes = (fn.inputs || [])
          .map((input) => input.type)
          .join(",");
        const signature = `${fn.name}(${inputTypes})`;
        return {
          value: signature,
          label: signature,
        };
      });
    }

    return [];
  }, [timelockType, allTimelocks]);

  useEffect(() => {
    if (currentTimelockDetails?.chain_id && parseInt(currentTimelockDetails.chain_id as string) !== chainId) {
      handleTimelockChange("");
      handleTimelockMethodChange();
    }
  }, [currentTimelockDetails, chainId]);

  const timeZone = () => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timeOffset = new Date().getTimezoneOffset() / 60;

    return zone ? `(${zone} UTC${timeOffset >= 0 ? "+" : ""}${timeOffset})` : `UTC${timeOffset >= 0 ? "+" : ""}${timeOffset}`;
  }

  function toLocalDateTimeString(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // 月份是 0-based
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div className="bg-white pt-6 flex flex-col gap-8 items-start">
      <SectionHeader title={t("encodingTransaction.title")} description={t("encodingTransaction.description")} icon={<Image src={QuestionIcon} alt="Question Icon" width={15} height={15} />} />
      <div className="flex flex-col space-y-4 w-full">
        <div className="flex flex-row gap-4 border border-gray-300 rounded-lg p-4" id="timelock-selection">
          <div className="flex-1">
            <SelectInput
              label={t("encodingTransaction.selectTimelock")}
              value={timelockType}
              onChange={handleTimelockChange}
              options={timelockOptions}
              placeholder={
                isLoadingDetails
                  ? t("encodingTransaction.loadingTimelockDetails")
                  : allTimelocks.length === 0
                    ? t("encodingTransaction.noTimelocksAvailable")
                    : t("encodingTransaction.selectTimelockPlaceholder")
              }
            />
          </div>
          <div className="flex-1">
            <SelectInput
              label={t("encodingTransaction.selectTimelockMethod")}
              value={timelockMethod}
              onChange={onTimelockMethodChange}
              options={timelockMethodOptions}
              placeholder={
                timelockType
                  ? t("encodingTransaction.selectTimelockMethodPlaceholder")
                  : t("encodingTransaction.selectTimelockFirstPlaceholder")
              }
            />
          </div>
        </div>

        <div id="transaction-details" className="border border-gray-300 rounded-lg p-4 mt-2">
          <TextInput label={t("encodingTransaction.target")} value={target} onChange={handleTargetChange} placeholder="Target" error={validationErrors.target} />
          <TextInput label={t("encodingTransaction.value")} defaultValue={0} value={value} onChange={handleValueChange} placeholder="Value" />
          <TextAreaInput
            label={t("encodingTransaction.calldata")}
            value={targetCalldata}
            onChange={() => { }}
            placeholder={t("encodingTransaction.calldataPlaceholder")}
            disabled={true}
            rows={3}
          />

          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("targetABI.time")}  {timeZone()}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="datetime-local"
                  value={toLocalDateTimeString(new Date(timeValue * 1000))}
                  className="max-w-[200px] border border-gray-300 rounded px-3 h-[34px]  focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onChange={e => {
                    const date = new Date(e.target.value);
                    if (!isNaN(date.getTime())) {
                      onTimeChange(Math.floor(date.getTime() / 1000));
                    }
                  }}
                />
                <TextInput
                  label=""
                  value={timeValue}
                  onChange={onTimeChange}
                  placeholder={t("encodingTransaction.timePlaceholder") || "Time (seconds)"}
                />
              </div>
            </div>
          </div>
        </div>

        <div id="target-abi-section" className="border border-gray-300 rounded-lg p-4 mt-2">
          <TargetABISection
            abiValue={abiValue}
            onAbiChange={onAbiChange}
            functionValue={functionValue}
            onFunctionChange={onFunctionChange}
            argumentValues={argumentValues}
            onArgumentChange={onArgumentChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EncodingTransactionForm;
