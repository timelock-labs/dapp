// components/email-address/VerificationCodeInput.tsx
import React, { useState, useRef, useEffect } from 'react';

interface VerificationCodeInputProps {
  onSendCode: () => void;
  onCodeChange: (code: string) => void;
  codeLength?: number;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ onSendCode, onCodeChange, codeLength = 6 }) => {
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    onCodeChange(code.join(''));
  }, [code, onCodeChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Take only the last digit entered
    setCode(newCode);

    // Move to next input if a digit is entered
    if (value && index < codeLength - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">接收验证码</label>
      <div className="flex items-center ">
        {Array.from({ length: codeLength / 2 }).map((_, i) => (
          <React.Fragment key={`part1-${i}`}>
            <input
              type="text"
              maxLength={1}
              value={code[i] || ''}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              ref={(el) => { inputRefs.current[i] = el as HTMLInputElement; }}
              className={`w-10 h-10 text-center border border-gray-300 shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 text-lg font-mono
                ${i === 0 ? 'rounded-l-md' : ''}
                ${i === codeLength / 2 - 1 ? 'rounded-r-md' : ''} 
              `}
            />
          </React.Fragment>
        ))}
        <span className="text-xl font-bold text-black mx-2">——</span>
        {Array.from({ length: codeLength / 2 }).map((_, i) => (
          <React.Fragment key={`part2-${i}`}>
            <input
              type="text"
              maxLength={1}
              value={code[i + codeLength / 2] || ''}
              onChange={(e) => handleChange(e, i + codeLength / 2)}
              onKeyDown={(e) => handleKeyDown(e, i + codeLength / 2)}
              ref={(el) => { inputRefs.current[i + codeLength / 2] = el as HTMLInputElement; }}
              className={`w-10 h-10 text-center border border-gray-300 shadow-sm focus:outline-none focus:ring-black-500 focus:border-black-500 text-lg font-mono
                ${i === codeLength / 2 - 1 ? 'rounded-r-md' : ''}
                 ${i === 0 ? 'rounded-l-md' : ''} 
              `}
            />
          </React.Fragment>
        ))}

        <button
          onClick={onSendCode}
          className="ml-4 bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          发送验证码
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;