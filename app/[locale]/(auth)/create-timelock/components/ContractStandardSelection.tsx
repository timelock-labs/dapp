import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import RadioButtonOption from "./RadioButtonOption";
import type { ContractStandardSelectionProps, StandardOptionConfig } from "@/types";

const STANDARD_OPTIONS: StandardOptionConfig[] = [
  {
    value: "compound",
    labelKey: "compoundStandardLabel",
    descriptionKey: "compoundStandardDescription",
  },
] as const;

/**
 * Contract standard selection component with radio button options
 * 
 * @param props - ContractStandardSelection component props
 * @returns JSX.Element
 */
const ContractStandardSelection: React.FC<ContractStandardSelectionProps> = ({ selectedStandard, onStandardChange }) => {
  const t = useTranslations("CreateTimelock");

  // Memoize standard options to prevent unnecessary re-renders
  const standardOptions = useMemo(() => STANDARD_OPTIONS, []);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{t("selectContractStandard")}</label>
      <div className="space-y-4">
        {standardOptions.map((option) => (
          <RadioButtonOption
            key={option.value}
            id={`${option.value}-standard`}
            name="contractStandard"
            value={option.value}
            label={t(option.labelKey || option.label || '')}
            description={t(option.descriptionKey || option.description || '')}
            checked={selectedStandard === option.value}
            onChange={() => onStandardChange(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractStandardSelection;
