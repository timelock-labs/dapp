import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useApi } from '@/hooks/useApi';
import { toast } from 'sonner';

interface MailboxCardProps {
  id: number;
  name: string;
  email: string;
  onDelete: (id: number, email: string) => void;
  onEdit: (mailbox: { id: number; name: string; email: string; }) => void;
}

const MailboxCard: React.FC<MailboxCardProps> = ({ id, name, email, onDelete, onEdit }) => {
  const { request: updateEmail } = useApi();

  const handleDeleteClick = () => {
    onDelete(id, email);
  };

  const handleEditClick = () => {
    onEdit({ id, name, email });
  };

  return (
    // Card
    <div className="bg-white  rounded-lg shadow-md border border-gray-200 flex flex-col justify-between h-[162px]">
     
      {/* Name and Email */}
      <div className='p-6  h-[98px]' >
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
      {/* Delete and Edit Buttons */}
      <div className="pt-4 pr-4 border-t border-gray-200 flex justify-end h-[64px] space-x-2">
        <button
          onClick={handleEditClick}
          className="w-[85px] h-[32px] text-center inline-flex items-center py-2 px-2 gap-py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-[#0A0A0A]">
            <PencilIcon className="w-4 h-4" />
            Edit
          </span>
        </button>
        <button
          onClick={handleDeleteClick}
          className="w-[85px] h-[32px] text-center inline-flex items-center py-2 px-2 gap-py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-[#0A0A0A]">
            <TrashIcon className="w-4 h-4" />
            Delete
          </span>
        </button>
      </div>
    </div>
  );
};

export default MailboxCard;