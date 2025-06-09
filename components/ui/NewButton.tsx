// components/ui/NewButton.tsx
import React from 'react';

interface NewButtonProps {
  onClick: () => void;
  label?: string;
}

const NewButton: React.FC<NewButtonProps> = ({ onClick, label = 'New' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path>
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default NewButton;