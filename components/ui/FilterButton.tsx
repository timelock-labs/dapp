// components/ui/FilterButton.tsx
import React from 'react';

interface FilterButtonProps {
  onClick: () => void;
  label?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, label = 'Filters' }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L4.293 6.707A1 1 0 014 6V3z" clipRule="evenodd"></path>
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;