// components/ui/NewButton.tsx
import React from 'react';
import AddSVG from '@/components/icons/add'; // Adjust the import path as necessary

interface NewButtonProps {
  onClick: () => void;
  label?: string;
}

const NewButton: React.FC<NewButtonProps> = ({ onClick, label = 'New' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex cursor-pointer items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black-500"
    >
      <AddSVG />
      {/* Optional label, can be omitted if not needed */}
      <span>{label}</span>
    </button>
  );
};

export default NewButton;