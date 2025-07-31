"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

const LANGUAGES = [
  { code: 'zh', label: '简体中文' },
  { code: 'en', label: 'English' }
];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');

  // 获取当前路径，去掉 locale 部分
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0];
  const restPath = '/' + segments.slice(1).join('/');

  const handleSwitch = (lang: string) => {
    if (lang === currentLocale) return;
    router.push(`/${lang}${restPath}`);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={t('language_switcher')}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={`px-3 py-1 rounded transition border text-sm font-medium ${
            locale === code
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:bg-gray-50'
          }`}
          aria-current={locale === code ? 'true' : undefined}
          aria-label={label}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
