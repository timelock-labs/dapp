"use client"
import React, { useState ,useEffect,useRef} from 'react'; // Import useState
import TableComponent from '@/components/ui/TableComponent'; // Import the generic table component
import SectionHeader from '@/components/ui/SectionHeader'; // Reusing SectionHeader
import { useRouter, useParams } from 'next/navigation';

// Define name for Timelock Contract data from Frame 2 (1).jpg
interface TimelockContract {
  id: string;
  chain: string;
  timelock: string;
  owner: string; // New column
  addedAt: string; // New column
  name: 'Pendding' | 'Witting' | 'Badge';
  endTime: string;
  chainIcon: React.ReactNode;
}

const dummyTimelockContracts: TimelockContract[] = [
  { id: 'tc1', chain: 'Ethereum', timelock: '0x17fg...a8n9', owner: '0x17fg...a8n9', addedAt: 'May 24,2025 12:26', name: 'Pendding', endTime: '3h', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 'tc2', chain: 'Arbitrum', timelock: '0x17fg...a8n9', owner: '0x17fg...a8n9', addedAt: 'May 24,2025 12:26', name: 'Witting', endTime: 'Table Cell Text', chainIcon: <span className="text-blue-500 text-base">🔷</span> },
  { id: 'tc3', chain: 'BSC', timelock: 'x17fg...a8n9', owner: 'x17fg...a8n9', addedAt: 'May 24,2025 12:26', name: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-yellow-500 text-base">🟡</span> },
  { id: 'tc4', chain: 'Ethereum', timelock: 'x17fg...a8n9', owner: 'x17fg...a8n9', addedAt: 'May 24,2025 12:26', name: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
  { id: 'tc5', chain: 'Ethereum', timelock: 'x17fg...a8n9', owner: 'x17fg...a8n9', addedAt: 'May 24,2025 12:26', name: 'Badge', endTime: 'Table Cell Text', chainIcon: <span className="text-gray-700 text-base">♦️</span> },
];

const getBadgeStyle = (name: TimelockContract['name']) => {
  switch (name) {
    case 'Pendding': return 'bg-white text-gray-800 border border-gray-300';
    case 'Witting': return 'bg-black text-white border border-black';
    case 'Badge': return 'bg-black text-white border border-black';
    default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const TimelockContractTable: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const locale = params.locale;

  const handleImportContract = () => {
    router.push(`/${locale}/import-timelock`);
  };
  const handleCreateContract = () => {
    router.push(`/${locale}/create-timelock`);
  };
  const handleEllipsisMenu = (rowId: string) => {
    if (openDropdownId === rowId) {
      setOpenDropdownId(null); // Close if already open
    } else {
      setOpenDropdownId(rowId); // Open for this row
    }
  };
  const handleDeleteClick = (row: TimelockContract) => {
    console.log('Delete clicked for row:', row.id);
    // Implement delete confirmation or action
    setOpenDropdownId(null); // Close dropdown after action
  };

  // Effect to handle clicks outside the dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setOpenDropdownId(null);
        }
      };
  
      if (openDropdownId) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdownId]);
  const columns = [
    {
      key: 'chain',
      header: 'Chain',
      render: (row: TimelockContract) => (
        <div className="inline-flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1">
          {row.chainIcon}
          <span className="text-gray-800">{row.chain}</span>
        </div>
      ),
    },
      {
      key: 'name',
      header: 'Name',
      render: (row: TimelockContract) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeStyle(row.name)}`}>
          {row.name}
        </span>
      ),
    },
    { key: 'timelock', header: 'Timelock' },
    { key: 'owner', header: 'Owner' }, // New column
    { key: 'addedAt', header: 'AddedAt' }, // New column
  
    {
      key: 'operations',
      header: 'operations', // Operations column
      render: (row: TimelockContract) => (
        <div className="relative"> {/* Make this div the positioning context for the dropdown */}
          <button onClick={() => handleEllipsisMenu(row.id)} className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
          {openDropdownId === row.id && (
            <div ref={dropdownRef}  className="absolute right-[30px] mt-2 w-32 bg-white rounded-md shadow-lg z-999 border border-gray-200"> {/* Dropdown container */}
              <button
                onClick={() => {
                  handleDeleteClick(row);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-gray-100 hover:text-red-700 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white "> {/* Wrapper with a light gray background */}
      <div className="mx-auto"> {/* Max width container to center content */}
        {/* Header and Buttons Section - All in one row */}
        <div className="flex items-center mb-6"> {/*  items-center for vertical alignment */}
          {/* Left Side: Section Header */}
          <div className="flex-grow"> {/* Use flex-grow to take up remaining space */}
            <SectionHeader
              title="添加Timelock 合约"
              description="Manage or upgrade your plan."
            />
          </div>
          {/* Right Side: Buttons */}
          <div className="flex transform -translate-y-2.5"> {/* Wrapper for buttons to move them up */}
            <button
              onClick={handleImportContract}
              className="bg-white text-gray-900 px-4 py-2 rounded-md border border-gray-300 font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              导入现有 Timelock 合约
            </button>
            <button onClick={handleCreateContract} className="ml-2.5 bg-black text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors text-sm">创建 Timelock 合约</button> {/* Adjusted margin to ml-2.5 for 10px */}
          </div>
        </div>
        <TableComponent<TimelockContract> columns={columns} data={dummyTimelockContracts} showPagination={true} itemsPerPage={5} />
      </div>
    </div>
  );
};

export default TimelockContractTable;