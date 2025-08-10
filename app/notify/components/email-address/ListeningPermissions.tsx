// components/email-address/ListeningPermissions.tsx
import React from 'react';
import { useTranslations } from 'next-intl';
import PermissionCheckbox from './PermissionCheckbox'; // Adjust path

interface PermissionItem {
	id: string;
	label: string;
	subLabel: string;
	icon: React.ReactNode;
}

interface ListeningPermissionsProps {
	permissions: PermissionItem[];
	selectedPermissions: string[]; // Array of IDs of selected permissions
	onPermissionChange: (id: string, checked: boolean) => void;
	isLoading?: boolean;
}

const ListeningPermissions: React.FC<ListeningPermissionsProps> = ({ permissions, selectedPermissions, onPermissionChange, isLoading = false }) => {
	const t = useTranslations('Notify');

	return (
		<div className='mb-6 pt-4'>
			<label className='block text-sm font-medium text-gray-700 mb-2'>{t('listeningPermissions.title')}</label>
			<div className='border border-gray-200 rounded-md p-4 space-y-2 bg-gray-50'>
				{isLoading ?
					<div className='text-center text-gray-500 py-4'>{t('listeningPermissions.loading')}</div>
				: permissions.length === 0 ?
					<div className='text-center text-gray-500 py-4'>{t('listeningPermissions.noTimelocks')}</div>
				:	permissions.map(permission => (
						<PermissionCheckbox
							key={permission.id}
							id={permission.id}
							label={permission.label}
							subLabel={permission.subLabel}
							icon={permission.icon}
							checked={selectedPermissions.includes(permission.id)}
							onChange={onPermissionChange}
						/>
					))
				}
			</div>
		</div>
	);
};

export default ListeningPermissions;
