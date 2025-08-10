// components/ui/ExportButton.tsx
import React from 'react';

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, label = 'Export' }) => {
  return (
    <button
      onClick={onClick}
      className='inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500'
    >
      <svg
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
        ></path>
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default ExportButton;
