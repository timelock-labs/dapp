import React, { useCallback } from "react";
import type { RadioButtonOptionProps } from "@/types";

/**
 * Radio button option component with label and description
 * 
 * @param props - RadioButtonOption component props
 * @returns JSX.Element
 */
const RadioButtonOption: React.FC<RadioButtonOptionProps> = ({ id, name, value, label, description, checked, onChange, className = "", disabled = false }) => {
  const handleChange = useCallback(() => {
    if (!disabled) {
      onChange(value);
    }
  }, [disabled, onChange, value]);

  const baseClasses = `
    flex items-start rounded-lg border cursor-pointer transition-all duration-200 p-2
    ${
      checked
        ? "border-black bg-gray-100" // Checked styles
        : "border-gray-300 hover:border-gray-400 bg-white" // Unchecked styles
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const radioClasses = `
    form-radio h-4 w-4 mt-1 mr-3 focus:ring-offset-0
    ${checked ? "bg-white text-transparent border-black border focus:ring-black" : "border-gray-200 text-gray-400 focus:ring-blue-500"}
    ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
  `;

  return (
    <label htmlFor={id} className={baseClasses}>
      <input type="radio" id={id} name={name} value={value} checked={checked} onChange={handleChange} disabled={disabled} className={radioClasses} aria-disabled={disabled} />
      <div className="flex-1">
        <p className="text-gray-900 font-medium text-base">{label}</p>
        {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
      </div>
    </label>
  );
};

export default RadioButtonOption;
