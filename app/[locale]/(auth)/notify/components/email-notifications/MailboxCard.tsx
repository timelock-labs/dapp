// components/email-notifications/MailboxCard.tsx
import React from 'react';

interface MailboxCardProps {
  id: string;
  name: string;
  email: string;
  onDelete: (id: string) => void;
}

const MailboxCard: React.FC<MailboxCardProps> = ({ id, name, email, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    // Card
    <div className="bg-white  rounded-lg shadow-md border border-gray-200 flex flex-col justify-between h-[162px]">
     
      {/* Name and Email */}
      <div className='p-6  h-[98px]' >
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500">{email}</p>
      </div>
      {/* Delete Button */}
      <div className="pt-4 pr-4 border-t border-gray-200 flex justify-end h-[64px] ">
        <button
          onClick={handleDeleteClick}
          className="w-[85px] h-[32px] text-center inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 110-2h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default MailboxCard;