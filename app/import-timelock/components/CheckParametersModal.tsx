// components/CheckParametersDialog.tsx
import React, { useState, useEffect, useRef, use } from 'react';
import { compoundTimelockAbi } from '@/contracts/abis/CompoundTimelock';

// Define interface for the data this dialog will display
interface CheckParametersDialogProps {
  isOpen: boolean; // Controls if the dialog is visible
  onClose: () => void; // Callback to close the dialog (used by buttons & Escape key)
  onConfirm: (abiContent: string) => void; // Callback on confirm, passes updated ABI content
  parameters: {
    // Data to display in the dialog
    chainName: string;
    chainIcon: React.ReactNode; // For the chain icon (e.g., Arbitrum icon)
    remarks: string;
    timelockAddress: string;
    abiPlaceholder?: string; // Initial placeholder for ABI textarea
  };
}

const CheckParametersDialog: React.FC<CheckParametersDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  parameters,
}) => {
  const [abiContent, setAbiContent] = useState(parameters.abiPlaceholder || '');
  const dialogRef = useRef<HTMLDivElement>(null); // Ref for focusing the dialog content

  // Effect to manage Escape key press
  useEffect(() => {
    if (!isOpen) return; // Only add listener if dialog is open

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Focus the dialog content when it opens for accessibility
    if (dialogRef.current) {
      dialogRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]); // Re-run effect if isOpen or onClose changes

  useEffect(() => {
    // Reset ABI content when dialog opens
    setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2));
  }, []);

  // If dialog is not open, don't render anything
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(abiContent);
    setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2)); // Reset ABI for next open, or clear
  };

  const handleCancel = () => {
    onClose();
    setAbiContent(JSON.stringify(compoundTimelockAbi, null, 2)); // Reset ABI for next open, or clear
  };

  // Inline component for read-only display rows
  const ParameterDisplayRow: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
  }) => (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
      <div className='bg-gray-100 text-gray-900 px-3 py-2 rounded-md inline-flex items-center text-sm font-mono'>
        {children}
      </div>
    </div>
  );

  const dialogTitleId = 'check-params-dialog-title'; // Unique ID for the dialog title

  return (
    // Dialog Overlay (Backdrop)
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      {/* Dialog Content */}
      <div
        ref={dialogRef} // Attach ref for focus management
        role='dialog' // ARIA role for dialog
        aria-modal='true' // Indicates that the dialog blocks content behind it
        aria-labelledby={dialogTitleId} // Links the dialog to its title for screen readers
        tabIndex={-1} // Makes the dialog content focusable
        className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 relative outline-none' // outline-none removes focus outline
      >
        {/* Dialog Title */}
        <h2 id={dialogTitleId} className='text-xl font-semibold text-gray-900 mb-6'>
          请检查参数
        </h2>

        {/* Parameter Display Fields */}
        <ParameterDisplayRow label='所在链'>
          {parameters.chainIcon}
          <span className='ml-2'>{parameters.chainName}</span>
        </ParameterDisplayRow>

        <ParameterDisplayRow label='备注'>{parameters.remarks}</ParameterDisplayRow>

        <ParameterDisplayRow label='Timelock地址'>{parameters.timelockAddress}</ParameterDisplayRow>

        {/* ABI Textarea */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>ABI</label>
          <textarea
            readOnly
            aria-label='ABI Content'
            value={abiContent}
            className='
              mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
              focus:outline-none focus:ring-blue-500 focus:border-blue-500
              sm:text-sm bg-gray-100 text-gray-900
            '
            rows={8}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            onClick={handleCancel}
            className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors'
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckParametersDialog;
