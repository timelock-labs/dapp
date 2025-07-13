// components/email-notifications/EmailRulesHeader.tsx
import React from 'react';
import { useTranslations } from 'next-intl';

const EmailRulesHeader: React.FC = () => {
  const t = useTranslations('Notify.emailRulesHeader');

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:space-x-8 justify-between" >
      {/* Title */}
      <div className="flex items-start space-x-3 mb-4 md:mb-0 md:w-1/4">
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0018 4H2a2 2 0 00-.003 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h14a2 2 0 002-2V8.118z"></path>
        </svg>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
      </div>

      {/* Rules List */}
      <div className="md:w-2/4">
       <ol className="list-decimal list-inside space-y-2 text-sm
         opacity-80 font-normal tracking-normal
          text-white 
        ">
          <li>
            {t('rule1')}
          </li>
          <li>
            {t('rule2Before')}
            <span className="underline underline-offset-0 decoration-[0px]">
              official@timelock.com
            </span>
            {t('rule2After')}
          </li>
          <li>
            {t('rule3')}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default EmailRulesHeader;