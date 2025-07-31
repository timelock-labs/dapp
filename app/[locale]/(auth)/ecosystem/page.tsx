
'use client';
import React, { useEffect, useState } from 'react';
import EcosystemSearchHeader from './components/EcosystemSearchHeader';
import PartnersGrid from './components/PartnersGrid';
import PageLayout from '@/components/layout/PageLayout';
import { useSponsorsApi } from '@/hooks/useSponsorsApi';
import { useTranslations } from 'next-intl';

const EcosystemPage: React.FC = () => {
    const t = useTranslations('Ecosystem');
    const [sponsors, setSponsors] = useState([]);
    const [partners, setPartners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getSponsors } = useSponsorsApi();

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                setIsLoading(true);
                const response = await getSponsors();
                if (response.success) {
                    setSponsors(response.data.sponsors || []);
                    setPartners(response.data.partners || []);
                }
            } catch (error) {
                console.error('Error fetching sponsors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSponsors();
    }, [getSponsors]);

    return (
        <PageLayout title={t('title')}>
            <div className="min-h-screen  ">
                <div className="mx-auto flex flex-col space-y-8 pt-4">
                    {/* Top Header Section */}
                    <EcosystemSearchHeader />

                    {/* Partners Grid Section */}
                    <PartnersGrid sponsors={sponsors} partners={partners} isLoading={isLoading} />
                </div>
            </div>
        </PageLayout>

    );
};

export default EcosystemPage;
