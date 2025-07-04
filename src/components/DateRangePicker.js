import React, { useState, useEffect, useRef } from 'react';

const DateRangePicker = ({ onSelectRange, onClose, triggerRef }) => {
  console.log('DateRangePicker: Component function executed (rendering).');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const datePickerRef = useRef(null); // Ref for the date picker content

  useEffect(() => {
    console.log('DateRangePicker: useEffect - Component mounted, attaching listeners.');
    const handleClickOutside = (event) => {
      console.log('DateRangePicker: handleClickOutside triggered. Event target:', event.target);
      // If the clicked element is the trigger button, do nothing.
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        console.log('DateRangePicker: Clicked on trigger button. Ignoring.');
        return;
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        console.log('DateRangePicker: Click detected outside date picker, calling onClose().');
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        console.log('DateRangePicker: Escape key pressed, calling onClose().');
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      console.log('DateRangePicker: useEffect cleanup - Removing listeners.');
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, triggerRef]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDayNames = () => {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  };

  const getPaddingDays = (date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const isSameDay = (d1, d2) => {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const handleDayClick = (day) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(day);
      setSelectedEnd(null);
    } else if (day < selectedStart) {
      setSelectedEnd(selectedStart);
      setSelectedStart(day);
    } else {
      setSelectedEnd(day);
    }
  };

  const renderMonth = (monthOffset) => {
    const displayMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const daysInMonth = getDaysInMonth(displayMonth);
    const paddingDays = getPaddingDays(displayMonth);
    const weekDayNames = getWeekDayNames();

    return (
      <div className="flex-1 px-2">
        <div className="flex justify-around items-center mb-2 px-1">
          <div className="text-gray-700 text-sm font-semibold flex items-center">
            {displayMonth.toLocaleString('default', { month: 'long' })}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-gray-700 text-sm font-semibold flex items-center">
            {displayMonth.getFullYear()}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-1">
          {weekDayNames.map((day, index) => (
            <div key={index} className="py-1">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center text-sm">
          {[...Array(paddingDays)].map((_, index) => (
            <div key={`pad-${index}`} className="p-2"></div>
          ))}
          {daysInMonth.map((day, index) => {
            const isSelected = (selectedStart && selectedEnd && day >= selectedStart && day <= selectedEnd) ||
                             isSameDay(day, selectedStart) || isSameDay(day, selectedEnd);
            const isStartDate = isSameDay(day, selectedStart);
            const isEndDate = isSameDay(day, selectedEnd);

            let dayClasses = "p-2 rounded-md cursor-pointer";
            if (isSelected) {
              dayClasses += " bg-gray-200 text-gray-900";
            } else {
              dayClasses += " text-gray-700 hover:bg-gray-100";
            }
            if (isStartDate && !isEndDate) {
              dayClasses += " rounded-r-none";
            }
            if (isEndDate && !isStartDate) {
              dayClasses += " rounded-l-none";
            }
            if (isStartDate && isEndDate) {
                dayClasses += " rounded-md";
            }

            return (
              <div key={index} className={dayClasses} onClick={() => handleDayClick(day)}>
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleApply = () => {
    console.log('DateRangePicker: handleApply called. selectedStart:', selectedStart, 'selectedEnd:', selectedEnd, 'preset: custom. Calling onSelectRange.');
    onSelectRange({ start: selectedStart, end: selectedEnd, preset: 'custom' });
  };

  const handlePresetSelect = (preset) => {
    setSelectedStart(null);
    setSelectedEnd(null);
    let start = null;
    let end = new Date(); // Today
    end.setHours(23, 59, 59, 999); // End of today

    switch (preset) {
      case 'past-week':
        start = new Date();
        start.setDate(start.getDate() - 7);
        break;
      case 'past-month':
        start = new Date();
        start.setMonth(start.getMonth() - 1);
        break;
      case 'past-3-months':
        start = new Date();
        start.setMonth(start.getMonth() - 3);
        break;
      case 'past-6-months':
        start = new Date();
        start.setMonth(start.getMonth() - 6);
        break;
      case 'past-year':
        start = new Date();
        start.setFullYear(start.getFullYear() - 1);
        break;
      case 'past-2-years':
        start = new Date();
        start.setFullYear(start.getFullYear() - 2);
        break;
      case 'all-time':
        start = null; // Indicate no start date for all time
        end = null; // Indicate no end date for all time
        break;
      case 'clear':
        start = null;
        end = null;
        break;
      default:
        return;
    }
    if (start) { start.setHours(0, 0, 0, 0); } // Start of day
    console.log('DateRangePicker: handlePresetSelect called. preset:', preset, 'start:', start, 'end:', end, '. Calling onSelectRange.');
    onSelectRange({ start, end, preset });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div ref={datePickerRef} className="bg-white p-6 rounded-lg shadow-xl relative max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex overflow-hidden">
          <div className="w-40 border-r border-gray-200 py-4">
            <ul className="text-sm text-gray-700">
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-week')}>Past week</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-month')}>Past month</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-3-months')}>Past 3 months</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-6-months')}>Past 6 months</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-year')}>Past year</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('past-2-years')}>Past 2 years</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handlePresetSelect('clear')}>Clear</li>
            </ul>
          </div>
          <div className="p-4 flex flex-col justify-between w-[40rem]">
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex space-x-6">
                {renderMonth(0)}
                {renderMonth(1)}
              </div>
              <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
