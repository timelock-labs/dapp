import React, { useState, useMemo } from "react";
import SelectInput from "@/components/ui/SelectInput";
import TextInput from "@/components/ui/TextInput";
import AddABIForm from "./AddABIForm";
import { useTranslations } from "next-intl";
import { useAbiApi } from "@/hooks/useAbiApi";
import { toast } from "sonner";
import type { TargetABISectionProps } from "./types";

const TargetABISection: React.FC<TargetABISectionProps> = ({ abiValue, onAbiChange, functionValue, onFunctionChange, argumentValues, onArgumentChange }) => {
  const t = useTranslations("CreateTransaction");
  const [isAddABIOpen, setIsAddABIOpen] = useState(false);
  const { abiList, isLoading, addAbi } = useAbiApi();

  // Convert ABI list to options format
  const abiOptions = useMemo(() => {
    if (!Array.isArray(abiList)) {
      return [];
    }
    return abiList.map((abi) => ({
      value: abi.id.toString(),
      label: abi.name,
    }));
  }, [abiList]);

  // Parse functions from selected ABI
  const functionOptions = useMemo(() => {
    if (!abiValue || !Array.isArray(abiList)) return [];

    const selectedAbi = abiList.find((abi) => abi.id.toString() === abiValue);
    if (!selectedAbi) return [];

    try {
      const abiContent = JSON.parse(selectedAbi.abi_content);
      return abiContent
        .filter((item: Record<string, unknown>) => {
          // Only include functions that are writable (not view or pure)
          return item.type === "function" && item.stateMutability !== "view" && item.stateMutability !== "pure";
        })
        .map((func: Record<string, unknown>) => {
          // Create unique value using function name and input types
          const inputs = Array.isArray(func.inputs) ? func.inputs : [];
          const inputTypes = inputs.map((input: Record<string, unknown>) => input.type).join(",");
          const uniqueValue = `${func.name}(${inputTypes})`;

          return {
            value: uniqueValue,
            label: func.name as string,
          };
        });
    } catch (error) {
      console.error("Error parsing ABI content:", error);
      return [];
    }
  }, [abiValue, abiList]);

  // Get selected function details including parameters
  const selectedFunctionDetails = useMemo(() => {
    if (!functionValue || !Array.isArray(abiList) || !abiValue) return null;

    const selectedAbi = abiList.find((abi) => abi.id.toString() === abiValue);
    if (!selectedAbi) return null;

    try {
      const abiContent = JSON.parse(selectedAbi.abi_content);

      // Extract function name from the value (format: "functionName(type1,type2)")
      const functionName = functionValue.split("(")[0];
      const inputTypesString = functionValue.match(/\((.*)\)/)?.[1] || "";
      const expectedInputTypes = inputTypesString ? inputTypesString.split(",") : [];

      const selectedFunction = abiContent.find((item: Record<string, unknown>) => {
        if (item.type !== "function" || item.name !== functionName) return false;

        // Match by input types to handle function overloading
        const inputs = Array.isArray(item.inputs) ? item.inputs : [];
        const actualInputTypes = inputs.map((input: Record<string, unknown>) => input.type);

        return JSON.stringify(actualInputTypes) === JSON.stringify(expectedInputTypes);
      });

      return selectedFunction || null;
    } catch (error) {
      console.error("Error parsing ABI content:", error);
      return null;
    }
  }, [functionValue, abiList, abiValue]);

  const handleAddABI = async (name: string, abi: string) => {
    try {
      await addAbi(name, "", abi);
      toast.success("ABI added successfully!");
      setIsAddABIOpen(false);
    } catch (error: unknown) {
      console.error("Failed to add ABI:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add ABI";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="rounded-md">
      <div className="flex items-end space-x-4 mb-4">
        <div className="flex-grow">
          <SelectInput
            label={t("targetABI.label")}
            value={abiValue}
            onChange={onAbiChange}
            options={abiOptions}
            placeholder={isLoading ? "Loading ABIs..." : abiOptions.length === 0 ? "No ABIs available" : t("targetABI.placeholder")}
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SelectInput label={t("targetABI.function")} value={functionValue} onChange={onFunctionChange} options={functionOptions} placeholder={t("targetABI.selectFunction")} />
        </div>

        {/* Dynamic function arguments */}
        {selectedFunctionDetails && selectedFunctionDetails.inputs && Array.isArray(selectedFunctionDetails.inputs) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Function Arguments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedFunctionDetails.inputs as Array<Record<string, unknown>>).map((input, index) => (
                <TextInput
                  key={index}
                  label={`${input.name || `Argument ${index + 1}`} (${input.type})`}
                  value={argumentValues[index] || ""}
                  onChange={(value) => onArgumentChange(index, value)}
                  placeholder={`Enter ${input.type} value`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <AddABIForm isOpen={isAddABIOpen} onClose={() => setIsAddABIOpen(false)} onAddABI={handleAddABI} />
    </div>
  );
};

export default TargetABISection;
