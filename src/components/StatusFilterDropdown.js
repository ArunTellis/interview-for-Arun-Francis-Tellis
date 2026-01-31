import React, { useState, useRef, useEffect } from 'react';

const StatusFilterDropdown = ({ statusFilter, setStatusFilter, setPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'all', label: 'All Launches' },
    { value: 'upcoming', label: 'Upcoming Launches' },
    { value: 'successful', label: 'Successful Launches' },
    { value: 'failed', label: 'Failed Launches' },
  ];

  const selectedLabel = options.find(option => option.value === statusFilter)?.label || 'All Launches';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value) => {
    setStatusFilter(value);
    setPage(1);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>  
      <div
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700 font-semibold">{selectedLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={option.value}
                className={`px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 ${index < options.length - 1 ? 'border-b border-dotted border-gray-300' : ''}`}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusFilterDropdown; 