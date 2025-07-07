// components/timelock-creation/RadioButtonOption.tsx
import React from 'react';

interface RadioButtonOptionProps {
  id: string;
  name: string; // Group name for radio buttons
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const RadioButtonOption: React.FC<RadioButtonOptionProps> = ({
  id,
  name,
  value,
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <label
      htmlFor={id}
      className={`
        flex items-start rounded-lg border cursor-pointer transition-all duration-200
        ${checked
          ? 'min-w-[548px] h-[65px] p-3 border-black bg-gray-100' // Checked styles
          : 'min-w-[548px] h-[65px] p-3 border-gray-300 hover:border-gray-400 bg-white'} // Unchecked styles
      `}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className={`
          form-radio h-4 w-4 mt-1 mr-3 focus:ring-offset-0  /* Base styles, size, positioning, and focus offset */
          ${checked
            ? 'bg-white text-transparent border-black border focus:ring-black' /* Checked: white bg, transparent dot, 1px black border, black focus ring */
            : 'border-gray-200 text-gray-400 focus:ring-blue-500' /* Unchecked: gray-200 border, default focus */
          }
        `}
      />
      <div>
        <p className="text-gray-900 font-medium text-base">{label}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </label>
  );
};

export default RadioButtonOption;