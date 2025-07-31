import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { FirstTimeTimelockIntroProps } from './types';

const FirstTimeTimelockIntro: React.FC<FirstTimeTimelockIntroProps> = ({
  onLearnMore,
  className = '',
}) => {
  const t = useTranslations('CreateTimelock');

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLearnMore) {
      onLearnMore();
    }
  };

  return (
    <div 
      className={`bg-black text-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}
      role="region"
      aria-label={t('firstTimeUser.title')}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>Info</title>
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-1">
            {t('firstTimeUser.title')}
          </h2>
          <p className="text-sm text-gray-300">
            {t('firstTimeUser.description')}
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleLearnMore}
        className="mt-4 sm:mt-0 w-full sm:w-auto bg-white text-black px-4 sm:px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
        aria-label={t('actions.learnMore')}
      >
        <span>{t('actions.learnMore')}</span>
        <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default FirstTimeTimelockIntro;