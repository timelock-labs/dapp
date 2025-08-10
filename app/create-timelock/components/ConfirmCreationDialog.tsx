'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ConfirmCreationDialogProps } from './types';
import ParameterDisplayRow from './ParameterDisplayRow';

const ConfirmCreationDialog: React.FC<ConfirmCreationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  creationDetails,
}) => {
  const t = useTranslations('ConfirmCreationDialog');
  const dialogRef = useRef<HTMLDivElement>(null);
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');

  // Reset remark and error when dialog opens
  useEffect(() => {
    if (isOpen) {
      setRemark('');
      setRemarkError('');
    }
  }, [isOpen]);

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

  // Handle form submission with validation
  const handleConfirm = () => {
    if (!remark.trim()) {
      setRemarkError(t('contractRemarkRequired'));
      return;
    }
    setRemarkError('');
    onConfirm(remark);
  };

  // Handle remark input change
  const handleRemarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(e.target.value);
    if (remarkError && e.target.value.trim()) {
      setRemarkError('');
    }
  };

  // If dialog is not open, don't render anything
  if (!isOpen) return null;

  const dialogTitleId = 'confirm-creation-dialog-title'; // Unique ID for the dialog title

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
        className='bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4 relative outline-none' // outline-none removes focus outline
      >
        {/* Dialog Title */}
        <h2 id={dialogTitleId} className='text-xl font-semibold text-gray-900 mb-6'>
          {t('title')}
        </h2>

        {/* Parameter Display Fields */}
        <ParameterDisplayRow label={t('chainLabel')}>
          {/* {creationDetails.chainIcon} */}
          <span className='ml-2'>{creationDetails.chainName}</span>
        </ParameterDisplayRow>

        <ParameterDisplayRow label={t('timelockAddressLabel')}>
          {creationDetails.timelockAddress}
        </ParameterDisplayRow>

        <ParameterDisplayRow label={t('initiatingAddressLabel')}>
          {creationDetails.initiatingAddress}
        </ParameterDisplayRow>

        <ParameterDisplayRow label={t('transactionHashLabel')}>
          {creationDetails.transactionHash}
        </ParameterDisplayRow>

        {/* Contract Remarks Input Field */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            {t('contractRemarkLabel')} <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className={`mt-1 block w-full px-3 py-2 rounded-md border shadow-sm bg-white text-gray-900 focus:ring-1 ${
              remarkError
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder={t('contractRemarkPlaceholder')}
            value={remark}
            onChange={handleRemarkChange}
            required
          />
          {remarkError && <p className='mt-1 text-sm text-red-600'>{remarkError}</p>}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end space-x-3 mt-6'>
          <button
            type='button'
            onClick={onClose}
            className='bg-white text-gray-900 px-6 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors'
          >
            {t('cancel')}
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            className='bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors'
          >
            {t('confirmAdd')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCreationDialog;
