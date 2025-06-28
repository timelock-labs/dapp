// components/email-notifications/EmailRulesHeader.tsx
import React from 'react';

const EmailRulesHeader: React.FC = () => {
  const rules = [
    '我们将对每一笔由 timelock 合约发出的交易进行监听并通知广播；',
    '请注意邮件将会以 official@timelock.com 邮件发出，如果未查阅到邮件请于垃圾箱中将邮件加入白名单；',
    '及时配置邮件，避免因未查看邮件而错过信息。',
  ];

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:space-x-8 justify-between" >
      {/* Title */}
      <div className="flex items-start space-x-3 mb-4 md:mb-0 md:w-1/4">
        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0018 4H2a2 2 0 00-.003 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h14a2 2 0 002-2V8.118z"></path>
        </svg>
        <h2 className="text-xl font-semibold">邮件通知规则</h2>
      </div>

      {/* Rules List */}
      <div className="md:w-2/4">
       <ol className="list-decimal list-inside space-y-2 text-sm
         opacity-80 font-normal tracking-normal
          text-white 
        ">
          {rules.map((rule, index) => (
            <li key={index}>
              {rule.includes('official@timelock.com') ? (
                <>
                  {rule.substring(0, rule.indexOf('official@timelock.com'))}
                  <span className="underline underline-offset-0 decoration-[0px]">
                    official@timelock.com
                  </span>
                  {rule.substring(rule.indexOf('official@timelock.com') + 'official@timelock.com'.length)}
                </>
              ) : (
                rule
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default EmailRulesHeader;