// components/transactions/TabbedNavigation.tsx
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabbedNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabbedNavigation: React.FC<TabbedNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex space-x-4  mb-6 -mt-2"> {/* Negative margin to align with title */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            pb-3 text-base font-medium transition-colors duration-200
            ${activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabbedNavigation;