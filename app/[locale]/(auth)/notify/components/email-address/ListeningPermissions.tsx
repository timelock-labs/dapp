// components/email-address/ListeningPermissions.tsx
import React from 'react';
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
}

const ListeningPermissions: React.FC<ListeningPermissionsProps> = ({
  permissions,
  selectedPermissions,
  onPermissionChange,
}) => {
  return (
    <div className="mb-6 pt-4 ">
      <label className="block text-sm font-medium text-gray-700 mb-2">监听权限</label>
      <div className="border border-gray-200 rounded-md p-4 space-y-2 bg-gray-50">
        {permissions.map((permission) => (
          <PermissionCheckbox
            key={permission.id}
            id={permission.id}
            label={permission.label}
            subLabel={permission.subLabel}
            icon={permission.icon}
            checked={selectedPermissions.includes(permission.id)}
            onChange={onPermissionChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ListeningPermissions;