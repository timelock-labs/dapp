import React from 'react';
interface SectionHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional icon next to title
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, icon }) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <span>{title}</span>
        {icon && <span >{icon}</span>}

      </h2>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default SectionHeader;