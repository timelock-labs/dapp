"use client"

import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface DeleteButtonProps {
  onDelete: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-7 h-7 p-1';
      case 'lg':
        return 'w-10 h-10 p-2';
      default:
        return 'w-8 h-8 p-1.5';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  const triggerClasses = variant === 'destructive' 
    ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={`${getSizeClasses()} ${triggerClasses} rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          aria-label="Delete"
          title="Delete"
        >
          <TrashIcon className={getIconSize()} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteButton;