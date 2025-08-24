import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { formatDateWithYear } from '@/utils/utils';
import copyToClipboard from '@/utils/copy';
import Tag from '@/components/tableContent/TableTag';
import Image from 'next/image';
interface ChannelCardProps {
	onDelete: (id: number, email: string) => void;
	onEdit: (channel: channelData) => void;
	id: string;
	type: string;
	remark?: string;
	created_at: string;
}

interface channelData {
	id: string; type: string; remark?: string; created_at: string;
}

import feishu from '../images/feishu.png';
import lark from '../images/lark.png';
import telegram from '../images/telegram.png';

const channelIcon = {
	feishu,
	lark,
	telegram,
};

const ChannelCard: React.FC<ChannelCardProps> = ({ id, type, remark, created_at, onDelete, onEdit }) => {
	const t = useTranslations('Notify.channel');

	const handleDeleteClick = () => {
		onDelete(id, type);
	};

	const handleEditClick = () => {
		const channelData = {
			id: id.toString(),
			remark: remark,
			created_at: created_at,
			type: type,
		} as channelData;
		onEdit(channelData);
	};

	return (
		<div className='bg-white rounded-lg  border border-gray-200 flex flex-col justify-between h-auto relative'>
			<div className='p-6'>
				<div className='text-lg flex items-center gap-2 font-semibold mb-1 cursor-pointer' onClick={() => copyToClipboard(type)}>
				</div>
				<div className='my-2'><Tag label={remark || '-'} colorType='green' /></div>
				<div className='text-xs'>
					<div>
						<strong>Added At:</strong> {formatDateWithYear(created_at) || '-'}
					</div>
				</div>
			</div>
			<div className='absolute top-[25px] right-[25px]'>
				<Image src={channelIcon[type].src} alt={type} width={40} height={40} />
			</div>
			<div className='pt-4 pr-4 border-t border-gray-200 flex justify-end h-[64px] space-x-2'>
				<button
					type="button"
					onClick={handleEditClick}
					className='w-[85px] h-[32px] text-center inline-flex items-center py-2 px-2 gap-py-2 border border-gray-300 rounded-md  text-sm font-medium   bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
					<span className='flex items-center gap-2 text-[#0A0A0A]'>
						<PencilIcon className='w-4 h-4' />
						{t('edit')}
					</span>
				</button>
				<button
					type="button"
					onClick={handleDeleteClick}
					className='w-[85px] h-[32px] text-center inline-flex items-center py-2 px-2 gap-py-2 border border-gray-300 rounded-md  text-sm font-medium   bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
					<span className='flex items-center gap-2 text-[#0A0A0A]'>
						<TrashIcon className='w-4 h-4' />
						{t('delete')}
					</span>
				</button>

			</div>
		</div>
	);
};

export default ChannelCard;
