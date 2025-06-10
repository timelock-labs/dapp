// components/ecosystem/PartnersGrid.tsx
import React from 'react';
import FeatureCard from '@/components/ui/FeatureCard'; // Adjust path based on where FeatureCard.tsx is saved

interface Partner {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

interface PartnersGridProps {
  partners: Partner[];
}

const PartnersGrid: React.FC<PartnersGridProps> = ({ partners }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">生态伙伴</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <FeatureCard
            key={partner.id}
            title={partner.title}
            description={partner.description}
            icon={partner.icon}
            link={partner.link}
          />
        ))}
      </div>
    </div>
  );
};

export default PartnersGrid;