import PageLayout from "@/components/layout/PageLayout";
import { useTranslations } from 'next-intl';

export default function TransactionsLogPage() {
	const t = useTranslations('Transactions');
	return <PageLayout title={t('title')}>
		<div className='bg-white flex flex-col space-y-8 min-h-full p-6'>

		</div>
	</PageLayout>
}


