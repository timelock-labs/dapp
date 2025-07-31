import React from 'react';
import { useTranslations } from 'next-intl';
import RadioButtonOption from './RadioButtonOption';
import type { ContractStandard, ContractStandardSelectionProps } from './types';

const STANDARD_OPTIONS = [
  {
    value: 'compound' as const,
    labelKey: 'compoundStandardLabel',
    descriptionKey: 'compoundStandardDescription'
  },
  {
    value: 'openzeppelin' as const,
    labelKey: 'openzeppelinStandardLabel',
    descriptionKey: 'openzeppelinStandardDescription'
  }
] as const;

const ContractStandardSelection: React.FC<ContractStandardSelectionProps> = ({
  selectedStandard,
  onStandardChange,
}) => {
  const t = useTranslations('CreateTimelock');

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('selectContractStandard')}
      </label>
      <div className="space-y-4">
        {STANDARD_OPTIONS.map((option) => (
          <RadioButtonOption
            key={option.value}
            id={`${option.value}-standard`}
            name="contractStandard"
            value={option.value}
            label={t(option.labelKey)}
            description={t(option.descriptionKey)}
            checked={selectedStandard === option.value}
            onChange={() => onStandardChange(option.value as ContractStandard)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContractStandardSelection;