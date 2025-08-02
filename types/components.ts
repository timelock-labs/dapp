/**
 * Component prop types and interfaces
 */

import type { ReactNode } from 'react';
import type { 
  BaseComponentProps, 
  ModalProps, 
  FormComponentProps, 
  ExtendedSelectOption,
  ContractStandard,
  Address,
  Hash,
  VoidCallback,
  ValueCallback
} from './common';
// import type { DeploymentResult } from './blockchain';

/**
 * Button component variants
 */
export type ButtonVariant = 
  | 'default' 
  | 'destructive' 
  | 'outline' 
  | 'secondary' 
  | 'ghost' 
  | 'link';

/**
 * Button component sizes
 */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Button component props
 */
export interface ButtonProps extends React.ComponentProps<"button"> {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

/**
 * Input component props
 */
export interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}

/**
 * Select component props
 */
export interface SelectProps<T = string> extends FormComponentProps<T> {
  options: ExtendedSelectOption[];
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
}

/**
 * Radio button option props
 */
export interface RadioButtonOptionProps extends BaseComponentProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: ValueCallback<string>;
  disabled?: boolean;
}

/**
 * Chain option for dropdowns
 */
export interface ChainOption extends ExtendedSelectOption {
  logo: string;
}

/**
 * Standard option configuration
 */
export interface StandardOption {
  value: string;
  label: string;
  description: string;
  disabled?: boolean;
}

/**
 * Standard option config for radio buttons
 */
export interface StandardOptionConfig {
  value: ContractStandard;
  labelKey: string;
  descriptionKey: string;
}

/**
 * Parameter display row props
 */
export interface ParameterDisplayRowProps extends BaseComponentProps {
  label: string;
  children: ReactNode;
}

/**
 * Contract standard selection props
 */
export interface ContractStandardSelectionProps extends BaseComponentProps {
  selectedStandard: ContractStandard;
  onStandardChange: ValueCallback<ContractStandard>;
}

/**
 * Creation details for confirmation dialog
 */
export interface CreationDetails {
  chainName: string;
  chainIcon: ReactNode;
  timelockAddress: Address;
  initiatingAddress: Address;
  transactionHash: Hash;
}

/**
 * Dialog details state
 */
export type DialogDetailsState = CreationDetails

/**
 * Confirm creation dialog props
 */
export interface ConfirmCreationDialogProps extends ModalProps {
  onConfirm: ValueCallback<string>;
  creationDetails: CreationDetails;
}

/**
 * Create timelock form props
 */
export interface CreateTimelockFormProps extends BaseComponentProps {
  selectedChain: number;
  onChainChange: ValueCallback<number>;
  selectedStandard: ContractStandard;
  onStandardChange: ValueCallback<ContractStandard>;
  minDelay: string;
  onMinDelayChange: ValueCallback<string>;
  onDeploy: VoidCallback;
  isLoading: boolean;
}

/**
 * Create timelock form state
 */
export interface CreateTimelockFormState {
  selectedChain: number;
  selectedStandard: ContractStandard;
  minDelay: string;
}

/**
 * Encoding transaction form props
 */
export interface EncodingTransactionFormProps extends BaseComponentProps {
  targetCalldata: string;
  timelockType: string;
  onTimelockTypeChange: ValueCallback<string>;
  timelockMethod: string;
  onTimelockMethodChange: ValueCallback<string>;
  target: string;
  onTargetChange: ValueCallback<string>;
  value: string;
  onValueChange: ValueCallback<string>;
  abiValue: string;
  onAbiChange: ValueCallback<string>;
  functionValue: string;
  onFunctionChange: ValueCallback<string>;
  timeValue: number;
  onTimeChange: ValueCallback<number>;
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  description: string;
  onDescriptionChange: ValueCallback<string>;
  onTimelockAddressChange: ValueCallback<string>;
  onTimelockDetailsChange?: (details: Record<string, unknown>) => void;
}

/**
 * Target ABI section props
 */
export interface TargetABISectionProps extends BaseComponentProps {
  abiValue: string;
  onAbiChange: ValueCallback<string>;
  functionValue: string;
  onFunctionChange: ValueCallback<string>;
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  timelockMethodParameters?: Array<{ name: string; type: string }>;
  selectedTimelockMethod?: string;
}

/**
 * Mailbox selection props
 */
export interface MailboxSelectionProps extends BaseComponentProps {
  selectedMailbox: string[];
  onMailboxChange: ValueCallback<string[]>;
}

/**
 * Encoding preview props
 */
export interface EncodingPreviewProps extends BaseComponentProps {
  previewContent: string;
}

/**
 * Add ABI form props
 */
export interface AddABIFormProps extends ModalProps {
  onAddABI: (name: string, description: string, abi: string) => void;
}

/**
 * ABI content structure
 */
export interface ABIContent {
  name: string;
  description: string;
  abi_content: string;
}

/**
 * View ABI form props
 */
export interface ViewABIFormProps extends ModalProps {
  viewAbiContent: ABIContent;
}

/**
 * ABI row structure
 */
export interface ABIRow {
  id: number;
  name: string;
  description: string;
  abi_content: string;
  owner: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Loading spinner props
 */
export interface LoadingSpinnerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

/**
 * Error boundary props
 */
export interface ErrorBoundaryProps extends BaseComponentProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

/**
 * Toast notification props
 */
export interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: VoidCallback;
  };
}

/**
 * Data table column definition
 */
export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

/**
 * Data table props
 */
export interface DataTableProps<T = unknown> extends BaseComponentProps {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  rowKey?: keyof T | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
}

/**
 * Form field props
 */
export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
}

/**
 * Card component props
 */
export interface CardProps extends BaseComponentProps {
  title?: string;
  extra?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  loading?: boolean;
}

/**
 * Tabs component props
 */
export interface TabsProps extends BaseComponentProps {
  activeKey?: string;
  onChange?: ValueCallback<string>;
  items: Array<{
    key: string;
    label: string;
    children: ReactNode;
    disabled?: boolean;
  }>;
}

/**
 * Drawer component props
 */
export interface DrawerProps extends ModalProps {
  placement?: 'left' | 'right' | 'top' | 'bottom';
  width?: string | number;
  height?: string | number;
  mask?: boolean;
  maskClosable?: boolean;
}