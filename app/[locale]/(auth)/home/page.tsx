
import {useLocale, useTranslations} from 'next-intl';
import PageLayout from '@/components/layout/PageLayout';


export default function Welcome() {
  const t = useTranslations('Welcome');
  
  

  return (
    <PageLayout title={t('title')}>
      <h1> welcome</h1>
    </PageLayout>
  );
}