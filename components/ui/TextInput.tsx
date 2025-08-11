import React from 'react';
import type { BaseComponentProps, ValueCallback } from '@/types';

type InputHTMLAttributes = React.InputHTMLAttributes<HTMLInputElement>;

type OnChangeType = ValueCallback<string> | ((event: React.ChangeEvent<HTMLInputElement>) => void);

interface TextInputProps extends BaseComponentProps, Omit<InputHTMLAttributes, 'onChange' | 'value'> {
	label: string;
	value: string;
	onChange: OnChangeType;
	error?: string | null;
}

/**
 * Enhanced text input component with label and error handling
 *
 * @param props - TextInput component props
 * @returns JSX.Element
 */
const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, placeholder, type = 'text', disabled = false, error = null, className = '', ...rest }) => {
	return (
		<div className='mb-4'>
			<label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
			<input
				type={type}
				className={`mt-1 block w-full px-3 py-2 border ${
					error ? 'border-red-500' : 'border-gray-300'
				} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 ${
					disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
				} ${className}`}
				placeholder={placeholder || label}
				value={value}
				onChange={e => {
					if (onChange.length === 1) {
						// Handle direct string handler
						(onChange as (value: string) => void)(e.target.value);
					} else {
						// Handle event handler
						(onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
					}
				}}
				disabled={disabled}
				{...rest}
			/>
			{error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
		</div>
	);
};

export default TextInput;
