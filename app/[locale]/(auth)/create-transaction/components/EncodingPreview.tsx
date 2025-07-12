import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { useTranslations } from 'next-intl';

interface EncodingPreviewProps {
  previewContent: string;
}

const EncodingPreview: React.FC<EncodingPreviewProps> = ({ previewContent }) => {
  const t = useTranslations('Transactions');

  return (
    // Use a grid layout for left (header) and right (content) sections
    <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start h-full border-b border-gray-300">
      {/* Left Column: Section Header */}
      <div className="lg:col-span-1 lg:sticky lg:top-4">
        <SectionHeader
          title={t('previewSectionTitle')}
          description={t('View and update your personal details and account information.')}
        />
      </div>
      {/* Right Column: Preview Content */}
      <div className="lg:col-span-1 bg-gray-900 text-gray-100 p-4 rounded-md text-sm font-mono whitespace-pre-wrap overflow-auto h-full min-h-[200px]"> {/* Added min-h for better visibility if content is short */}
        {previewContent || "No data to preview."} {/* Added a fallback message */}
      </div>
    </div>
  );
};

export default EncodingPreview;