import type { ReactNode, ChangeEvent } from "react";

/**
 * Chain option for dropdown selection
 */
export interface ChainOption {
  value: string;
  label: string;
  logo: string;
}

/**
 * Props for CreateTimelockForm component
 */
export interface CreateTimelockFormProps {
  selectedChain: number;
  onChainChange: (value: number) => void;
  selectedStandard: ContractStandard;
  onStandardChange: (value: ContractStandard) => void;
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


/**
 * Props for RadioButtonOption component
 */
export interface RadioButtonOptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Props for StandardOption component
 */
export interface StandardOption {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
}

/**
 * Props for FirstTimeTimelockIntro component
 */
export interface FirstTimeTimelockIntroProps {
  onLearnMore?: () => void;
  className?: string;
}

/**
 * Supported contract standard types
 */
export type ContractStandard = 'compound' | 'openzeppelin';

/**
 * Props for ContractStandardSelection component
 */
export interface ContractStandardSelectionProps {
  selectedStandard: ContractStandard;
  onStandardChange: (standard: ContractStandard) => void;
}

/**
 * Props for ConfirmCreationDialog component
 */
export interface ConfirmCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remark: string) => void;
  creationDetails: CreationDetails;
}

/**
 * Details about the contract creation to display in the dialog
 */
export interface CreationDetails {
  chainName: string;
  chainIcon: ReactNode;
  timelockAddress: string;
  initiatingAddress: string;
  transactionHash: string;
}

/**
 * Props for ParameterDisplayRow component
 */
export interface ParameterDisplayRowProps {
  label: string;
  children: ReactNode;
}
