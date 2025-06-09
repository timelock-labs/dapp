"use client"

import React, { useState } from 'react';
import FirstTimeTimelockIntro from './FirstTimeTimelockIntro'; // Adjust path
import CreateTimelockForm from './CreateTimelockForm';       // Adjust path

const CreateTimelockPage: React.FC = () => {
  // State for form fields
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('compound'); // Default selected
  const [minDelay, setMinDelay] = useState('');

  const handleCreate = () => {
    alert('Create button clicked!');
    console.log({ selectedChain, selectedStandard, minDelay });
    // Implement actual creation logic here
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto flex flex-col space-y-8"> {/* Overall vertical stack */}

        {/* Top Info Section */}
        <FirstTimeTimelockIntro />

        {/* Main Form Area */}
        <CreateTimelockForm
          selectedChain={selectedChain}
          onChainChange={setSelectedChain}
          selectedStandard={selectedStandard}
          onStandardChange={setSelectedStandard}
          minDelay={minDelay}
          onMinDelayChange={setMinDelay}
        />

        {/* Create Button (Bottom Right) */}
        <div className="flex justify-end mt-4"> {/* Pushes button to bottom right */}
          <button
            onClick={handleCreate}
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTimelockPage;