/**
 * Component prop types and interfaces
 * Re-exports all component types from modular files
 */

// UI component types
export type { 
  ButtonVariant, 
  ButtonSize, 
  ButtonProps, 
  InputProps 
} from './components/ui';

// Timelock component types
export type {
  ChainOption,
  StandardOption,
  StandardOptionConfig,
  CreateTimelockFormState,
  CreateTimelockFormProps,
  ContractStandardSelectionProps,
  RadioButtonOptionProps,
  CreationDetails,
  DialogDetailsState,
  ConfirmCreationDialogProps,
  ParameterDisplayRowProps,
  DeploymentResult,
  CompoundTimelockParams
} from './components/timelock';