// components/ui/TextAreaInput.tsx
import React from 'react';

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number; // Number of rows for the textarea height
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, onChange, placeholder, rows = 8 }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        rows={rows}
        className="
          mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-blue-500 focus:border-blue-500
          sm:text-sm bg-white text-gray-900
        "
        placeholder={placeholder || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextAreaInput;