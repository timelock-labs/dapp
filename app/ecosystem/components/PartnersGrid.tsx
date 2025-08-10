'use client';
import React from 'react';
import FeatureCard from '@/components/ui/FeatureCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { Partner } from '@/types/api';

interface PartnersGridProps {
  sponsors: Partner[];
  partners: Partner[];
  isLoading: boolean;
}

const PartnersGrid: React.FC<PartnersGridProps> = ({ sponsors, partners, isLoading }) => {
  const t = useTranslations('Ecosystem');
  // Skeleton component for partner cards
  const PartnerSkeleton = () => (
    <div className='bg-white p-6 rounded-lg border border-gray-200 flex flex-col items-start'>
      <div className='flex justify-between items-center w-full mb-4'>
        <Skeleton className='w-10 h-10 rounded-full' />
        <Skeleton className='w-5 h-5' />
      </div>
      <Skeleton className='h-5 w-3/4 mb-1' />
      <Skeleton className='h-4 w-full' />
    </div>
  );

  return (
    <>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('sponsors')}</h2>
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 3 }).map((_, index) => (
              <PartnerSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sponsors.map(partner => (
              <FeatureCard
                key={partner.id}
                title={partner.name}
                description={partner.description}
                icon={
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-full overflow-hidden'
                  />
                }
                link={partner.link}
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>{t('partners')}</h2>
        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 3 }).map((_, index) => (
              <PartnerSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {partners.map(partner => (
              <FeatureCard
                key={partner.id}
                title={partner.name}
                description={partner.description}
                icon={
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className='w-10 h-10 rounded-full overflow-hidden'
                  />
                }
                link={partner.link}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PartnersGrid;
