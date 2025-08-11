'use client';
import React, { useEffect, useState } from 'react';
import EcosystemSearchHeader from './components/EcosystemSearchHeader';
import PartnersGrid from './components/PartnersGrid';
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
import type { Partner } from '@/types/api';
import { useApi } from '@/hooks/useApi';

const EcosystemPage: React.FC = () => {
	const t = useTranslations('Ecosystem');
	const [sponsors, setSponsors] = useState<Partner[]>([]);
	const [partners, setPartners] = useState<Partner[]>([]);

	const { request: getSponsors, isLoading } = useApi();

	useEffect(() => {
		fetchSponsors();
	}, []);

	const fetchSponsors = async () => {
		const response = await getSponsors('/api/v1/sponsors/public');
		if (response.success && response.data) {
			setSponsors(response.data.sponsors || []);
			setPartners(response.data.partners || []);
		}
	};

	return (
		<PageLayout title={t('title')}>
			<div className='min-h-screen  '>
				<div className='mx-auto flex flex-col space-y-8 pt-4'>
					<EcosystemSearchHeader />
					<PartnersGrid sponsors={sponsors} partners={partners} isLoading={isLoading} />
				</div>
			</div>
		</PageLayout>
	);
};

export default EcosystemPage;
