"use client";
import React, { useState, useEffect, useRef } from 'react';
import SectionHeader from '@/components/ui/SectionHeader'; // Assuming SectionHeader is in components/ui/
import TableComponent from '@/components/ui/TableComponent';   // Assuming TableComponent is in components/
import PageLayout from '@/components/layout/PageLayout';
import { useTranslations } from 'next-intl';
// Define the interface for a single ABI row
interface ABIRow {
  id: string; // Unique ID for the row, required by TableComponent
  abiName: string; // ABI Name (e.g., "Uniswap 团队金库")
  addressUser: string; // Address User (e.g., "0x002dwe213ewq")
  addedTime: string; // Added Time (e.g., "May 25, 2025 19:35")
}

const ABILibPage: React.FC = () => {
  const t = useTranslations("ABI-Lib")
  // State to manage which row's dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Dummy data for the ABI table
  const dummyABIs: ABIRow[] = [
    { id: 'abi1', abiName: 'Uniswap 团队金库', addressUser: '0x002dwe213ewq', addedTime: 'May 25, 2025 19:35' },
    { id: 'abi2', abiName: 'Uniswap 团队金库', addressUser: '0x002dwe213ewq', addedTime: 'May 25, 2025 19:35' },
    { id: 'abi3', abiName: 'Uniswap 团队金库', addressUser: '0x002dwe213ewq', addedTime: 'May 25, 2025 19:35' },
    { id: 'abi4', abiName: 'Uniswap 团队金库', addressUser: '0x002dwe213ewq', addedTime: 'May 25, 2025 19:35' },
    { id: 'abi5', abiName: 'Uniswap 团队金库', addressUser: '0x002dwe213ewq', addedTime: 'May 25, 2025 19:35' },
    // Add more dummy data as needed for pagination testing
  ];

  const handleNewABI = () => {
    console.log('New ABI button clicked!');
    // Implement logic to open a form/modal to add a new ABI
  };

  const handleViewABI = (row: ABIRow) => {
    console.log('View ABI clicked for:', row.id);
    // Implement logic to display the full ABI content, perhaps in a modal
  };

  const handleEllipsisMenu = (rowId: string) => {
    if (openDropdownId === rowId) {
      setOpenDropdownId(null); // Close if already open
    } else {
      setOpenDropdownId(rowId); // Open for this row
    }
  };
  const handleDeleteABI = (row: ABIRow) => {
    console.log('Delete ABI clicked for:', row.id);
    if (window.confirm(`Are you sure you want to delete ABI: ${row.abiName}?`)) {
      // Implement actual delete logic (e.g., filter dummyABIs, make API call)
      alert(`ABI ${row.abiName} deleted (simulated).`);
      setOpenDropdownId(null); // Close dropdown after action
    }
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

  // Define columns for TableComponent
  const columns = [
    { key: 'abiName', header: 'ABI Name' },
    { key: 'addressUser', header: 'Address User' },
    { key: 'addedTime', header: 'Added Time' },
    {
      key: 'operations',
      header: '操作', // Operations column
      render: (row: ABIRow) => (
        <div className="relative flex items-center space-x-2">
          <button
            onClick={() => handleViewABI(row)}
            className="text-black hover:underline text-sm font-medium underline"
          >
            查看ABI
          </button>

          <div className="relative">
            <button onClick={() => handleEllipsisMenu(row.id)} className="text-gray-500 hover:text-gray-800 p-1 rounded-md hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
            </button>
            {openDropdownId === row.id && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200"> {/* Dropdown container */}
                <button
                  onClick={() => handleDeleteABI(row)}
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

        </div>
      ),
    },
  ];

  return (
    <PageLayout title={t('title')}>
      <div className="min-h-screen  "> {/* Page background */}
        <div className="mx-auto border border-gray-200 rounded-lg p-6 "> {/* Centered content area */}
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <SectionHeader
              title="已存储ABI"
              description="该页面提供 ABI 的存储，供发起交易时侯选择 ABI"
            />
            {/* New Button - styled black */}
            <button
              onClick={handleNewABI}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m0 0H6"></path>
              </svg>
              <span>New</span>
            </button>
          </div>

          {/* ABI Table */}
          <TableComponent<ABIRow>
            columns={columns}
            data={dummyABIs}
            showPagination={false} // Image does not show pagination for this table
            itemsPerPage={5} // Max 5 items visible in image
          />
        </div>
      </div>
    </PageLayout>

  );
};

export default ABILibPage;