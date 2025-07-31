// ABI-Lib shared types

/**
 * ABI row structure as returned from the API
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
 * Props for the AddABIForm component (for adding a new ABI)
 */
export interface AddABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddABI: (name: string, description: string, abi: string) => void;
}

/**
 * ABI Content structure used for viewing ABI details
 */
export interface ABIContent {
  name: string;
  description: string;
  abi_content: string; // JSON string
}

/**
 * Props for the ViewABIForm component (for viewing ABI details)
 */
export interface ViewABIFormProps {
  isOpen: boolean;
  onClose: () => void;
  viewAbiContent: ABIContent;
}
