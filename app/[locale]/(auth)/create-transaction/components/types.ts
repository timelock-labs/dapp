// create-transaction 相关类型统一定义

// EncodingTransactionForm 组件 Props
export interface EncodingTransactionFormProps {
  targetCalldata: string;
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
  timeValue: number;
  onTimeChange: (value: number) => void;
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  onTimelockAddressChange: (address: string) => void;
  onTimelockDetailsChange?: (details: Record<string, unknown>) => void;
}

// TargetABISection 组件 Props
export interface TargetABISectionProps {
  abiValue: string;
  onAbiChange: (value: string) => void;
  functionValue: string;
  onFunctionChange: (value: string) => void;
  argumentValues: string[];
  onArgumentChange: (index: number, value: string) => void;
  timelockMethodParameters?: Array<{ name: string; type: string }>;
  selectedTimelockMethod?: string;
}

// MailboxSelection 组件 Props
export interface MailboxSelectionProps {
  selectedMailbox: string[];
  onMailboxChange: (value: string[]) => void;
}

// EncodingPreview 组件 Props
export interface EncodingPreviewProps {
  previewContent: string;
}

// AddABIForm 组件 Props
export interface AddABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddABI: (name: string, abi: string) => void;
}
