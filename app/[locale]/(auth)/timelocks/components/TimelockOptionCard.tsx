import React from 'react';

interface TimelockOptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const TimelockOptionCard: React.FC<TimelockOptionCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-6 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200 ease-in-out"
      onClick={onClick}
    >
      <div className="mb-4 text-blue-500">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-center text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default TimelockOptionCard;
