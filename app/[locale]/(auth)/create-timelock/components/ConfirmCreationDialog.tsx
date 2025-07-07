"use client"
import React, { useEffect, useRef } from 'react';

// Define interface for the data this dialog will display
interface ConfirmCreationDialogProps {
  isOpen: boolean; // Controls if the dialog is visible
  onClose: () => void; // Callback to close the dialog (used by buttons & Escape key)
  onConfirm: () => void; // Callback on confirm (e.g., final submit)
  creationDetails: { // Data to display in the dialog
    chainName: string;
    chainIcon: React.ReactNode; // For the chain icon (e.g., Arbitrum icon)
    timelockAddress: string;
    initiatingAddress: string;
    transactionHash: string;
    contractRemarks: string;
  };
}

const ConfirmCreationDialog: React.FC<ConfirmCreationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  creationDetails,
}) => {
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

  // If dialog is not open, don't render anything
  if (!isOpen) return null;

  // Inline component for read-only display rows
  const ParameterDisplayRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-md inline-flex items-center text-sm font-mono">
        {children}
      </div>
    </div>
  );

  const dialogTitleId = "confirm-creation-dialog-title"; // Unique ID for the dialog title

  return (
    // Dialog Overlay (Backdrop)
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
      {/* Dialog Content */}
      <div
        ref={dialogRef} // Attach ref for focus management
        role="dialog" // ARIA role for dialog
        aria-modal="true" // Indicates that the dialog blocks content behind it
        aria-labelledby={dialogTitleId} // Links the dialog to its title for screen readers
        tabIndex={-1} // Makes the dialog content focusable
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 relative outline-none" // outline-none removes focus outline
      >
        {/* Dialog Title */}
        <h2 id={dialogTitleId} className="text-xl font-semibold text-gray-900 mb-6">请检查参数</h2>

        {/* Parameter Display Fields */}
        <ParameterDisplayRow label="所在链">
          {creationDetails.chainIcon}
          <span className="ml-2">{creationDetails.chainName}</span>
        </ParameterDisplayRow>

        <ParameterDisplayRow label="Timelock地址">
          {creationDetails.timelockAddress}
        </ParameterDisplayRow>

        <ParameterDisplayRow label="发起地址">
          {creationDetails.initiatingAddress}
        </ParameterDisplayRow>

        <ParameterDisplayRow label="交易Hash">
          {creationDetails.transactionHash}
        </ParameterDisplayRow>

        {/* Contract Remarks is a TextInput, not a display row in this modal */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">合约备注</label>
          <input
            type="text" // Input field for remarks
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm bg-white text-gray-900"
            placeholder="Placeholder" // As in the image
            value={creationDetails.contractRemarks} // This field is read-only in the modal
            readOnly // Make it read-only
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose} // Cancel closes the dialog
            className="bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm} // Confirm closes the dialog and triggers parent's confirm logic
            className="bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCreationDialog;