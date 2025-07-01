
import React from 'react';
import EcosystemSearchHeader from './components/EcosystemSearchHeader';
import PartnersGrid from './components/PartnersGrid';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';

const EcosystemPage: React.FC = () => {
    const t = useTranslations('Ecosystem');

    // Dummy data for partner cards (emojis for icons for simplicity)
    const dummyPartners = [
        { id: 'p1', title: 'Title Text', description: 'This is a card description.', icon: '🦄', link: '#' },
        { id: 'p2', title: 'Title Text', description: 'This is a card description.', icon: '$', link: '#' },
        { id: 'p3', title: 'Title Text', description: 'This is a card description.', icon: '🐰', link: '#' },
        { id: 'p4', title: 'Title Text', description: 'This is a card description.', icon: '₿', link: '#' },
        { id: 'p5', title: 'Title Text', description: 'This is a card description.', icon: '💎', link: '#' },
        { id: 'p6', title: 'Title Text', description: 'This is a card description.', icon: '€', link: '#' },
        { id: 'p7', title: 'Title Text', description: 'This is a card description.', icon: '🧩', link: '#' },
     
    ];

    return (
        <PageLayout title={t('title')}>
            <div className="min-h-screen  ">
                <div className="mx-auto flex flex-col space-y-8 pt-4">
                    {/* Top Header Section */}
                    <EcosystemSearchHeader />

                    {/* Partners Grid Section */}
                    <PartnersGrid partners={dummyPartners} />
                </div>
            </div>
        </PageLayout>

    );
};

export default EcosystemPage;