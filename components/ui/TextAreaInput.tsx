// components/ui/TextAreaInput.tsx
import React from 'react';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number; // Number of rows for the textarea height
  disabled?: boolean; // Optional prop to disable the textarea
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, onChange, placeholder, rows = 8,disabled=false }) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>
      <textarea
      rows={rows}
      className={`
        mt-1 block w-full px-3 py-2 border rounded-md shadow-sm
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        sm:text-sm text-gray-900
        ${disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300'}
      `}
      placeholder={placeholder || label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      />
    </div>
  );
};

export default TextAreaInput;