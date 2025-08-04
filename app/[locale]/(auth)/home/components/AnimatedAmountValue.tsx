import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface AnimatedAmountValueProps {
  value: number;
  className?: string;
  maxDigits?: number; // Maximum digits before switching to scientific notation
}

const AnimatedAmountValue: React.FC<AnimatedAmountValueProps> = ({
  value,
  className = '',
  maxDigits = 8 // Default: switch to scientific notation if more than 8 digits
}) => {
  const numValue = value || 0;
  
  // Check if the number should be displayed in scientific notation
  const shouldUseScientific = Math.abs(numValue) >= Math.pow(10, maxDigits) || 
                              (Math.abs(numValue) < 0.0001 && Math.abs(numValue) > 0);
  
  if (shouldUseScientific) {
    // For scientific notation, we'll format it manually and animate the coefficient
    const scientificStr = numValue.toExponential(2);
    const [coefficient, exponent] = scientificStr.split('e');
    const coefficientNum = parseFloat(coefficient);
    
    const countUpRef = useCountUp({
      end: coefficientNum,
      duration: 1.5,
      decimals: 2,
      separator: '',
    });

    return (
      <span className={className}>
        <span ref={countUpRef}>0.00</span>
        e{exponent}
      </span>
    );
  } else {
    // For normal numbers, use regular formatting with appropriate decimals
    const decimals = numValue < 1 ? 6 : 4;
    
    const countUpRef = useCountUp({
      end: numValue,
      duration: 1.5,
      decimals,
      separator: ',',
    });

    return (
      <span ref={countUpRef} className={className}>
        {numValue < 1 ? '0.000000' : '0.0000'}
      </span>
    );
  }
};

export default AnimatedAmountValue;