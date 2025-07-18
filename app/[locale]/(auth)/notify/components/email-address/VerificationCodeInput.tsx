import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface VerificationCodeInputProps {
  email: string;
  onSendCode: () => Promise<void>;
  onCodeChange: (code: string) => void;
  codeLength?: number;
  buttonText?: string;
  disabledText?: string;
  isFirstTime?: boolean;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({ 
  email, 
  onSendCode, 
  onCodeChange, 
  codeLength = 6, 
  buttonText, 
  disabledText,
  isFirstTime = true
}) => {
  const t = useTranslations('Notify.verificationCode');
  const [code, setCode] = useState<string[]>(Array(codeLength).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [countdown, setCountdown] = useState(0); // New state for countdown
  const [isSendingCode, setIsSendingCode] = useState(false); // New state for button disable

  useEffect(() => {
    onCodeChange(code.join(''));
  }, [code, onCodeChange]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setIsSendingCode(false); // Re-enable button when countdown finishes
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

  const handleResendCode = async () => {
    if (!email) {
      toast.error(t('pleaseEnterEmail'));
      return;
    }
    setIsSendingCode(true); // Disable button
    setCountdown(60); // Start countdown

    try {
      await onSendCode(); // Call the parent's onSendCode function
    } catch (error) {
      console.error('Error sending code:', error);
      setIsSendingCode(false); // Re-enable button if sending fails
      setCountdown(0); // Reset countdown if sending fails
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{t('label')}</label>
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
          type="button"
          onClick={handleResendCode}
          disabled={isSendingCode}
          className="ml-4 bg-black text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingCode ? (
            disabledText || `${isFirstTime ? t('sending') : t('resending')} (${countdown}s)`
          ) : (
            buttonText || (isFirstTime ? t('sendCode') : t('resendCode'))
          )}
        </button>
      </div>
    </div>
  );
};

export default VerificationCodeInput;