import React, { useState, useEffect, useRef, useCallback } from 'react';
import spacexLogo from './assets/image.png';
import LaunchModal from './components/LaunchModal'; // Import the LaunchModal component
import DateRangePicker from './components/DateRangePicker'; // Import the DateRangePicker component
import StatusFilterDropdown from './components/StatusFilterDropdown'; // Import the StatusFilterDropdown component

function App() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const datePickerTriggerRef = useRef(null); // Ref for the date picker trigger button

  useEffect(() => {
    console.log('App.js: showDatePicker changed to:', showDatePicker);
  }, [showDatePicker]);

  const handleSelectRange = useCallback(({ start, end, preset }) => {
    setStartDate(start);
    setEndDate(end);
    setDateRangeFilter(preset);
    setShowDatePicker(false);
    setPage(1);
    console.log('App.js: Date range selected. showDatePicker set to false.');
  }, []); // Dependencies will be added if needed, but for now, empty array for stability

  const handleCloseDatePicker = useCallback(() => {
    setShowDatePicker(false);
    console.log('App.js: Date picker closed. showDatePicker set to false.');
  }, []);

  const launchesPerPage = 10;

  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      setError(null);
      try {
        let queryBody = {
          query: {},
          options: {
            limit: launchesPerPage,
            page: page,
            populate: [
              {
                path: 'rocket',
                select: { name: 1 }
              },
              {
                path: 'launchpad',
                select: { name: 1 }
              }
            ],
            sort: {
              date_unix: 'desc'
            }
          }
        };

        // Apply status filter
        if (statusFilter === 'upcoming') {
          queryBody.query = { ...queryBody.query, upcoming: true };
          queryBody.options.sort = { date_unix: 'asc' };
        } else if (statusFilter === 'past') {
          queryBody.query = { ...queryBody.query, upcoming: false };
        } else if (statusFilter === 'successful') {
          queryBody.query = { ...queryBody.query, success: true };
        } else if (statusFilter === 'failed') {
          queryBody.query = { ...queryBody.query, success: false };
        }

        // Apply date range filter
        if (startDate && endDate) {
          queryBody.query = {
            ...queryBody.query,
            date_utc: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
          };
        } else if (dateRangeFilter === 'past-6-months') {
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          queryBody.query = {
            ...queryBody.query,
            date_utc: { $gte: sixMonthsAgo.toISOString() },
          };
        }

        const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryBody),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLaunches(data.docs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch launches:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [statusFilter, dateRangeFilter, page]); 

  const openModal = (launch) => {
    setSelectedLaunch(launch);
  };

  const closeModal = () => {
    setSelectedLaunch(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const getLaunchStatus = (launch) => {
    if (launch.upcoming) {
      return <span className="px-2 py-1 rounded-sm font-semibold text-yellow-700 bg-yellow-50 text-xs">Upcoming</span>;
    } else if (launch.success) {
      return <span className="px-2 py-1 rounded-sm font-semibold text-green-700 bg-green-50 text-xs">Success</span>;
    } else {
      return <span className="px-2 py-1 rounded-sm font-semibold text-red-700 bg-red-50 text-xs">Failed</span>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">Loading launches...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <header className="flex flex-col items-center justify-center py-4 bg-white shadow-sm border-b border-gray-200">
        <img src={spacexLogo} className="h-8 w-auto" alt="SpaceX Logo" />
      </header>
      <main className="container mx-auto px-8 py-10 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="relative flex items-center space-x-2 mb-4 md:mb-0 bg-white rounded-lg shadow-md border border-gray-200 px-3 py-2">
            <button type="button" ref={datePickerTriggerRef} className="text-sm text-gray-700 font-semibold flex items-center space-x-1 cursor-pointer" onClick={() => {
              console.log('Button clicked! Toggling date picker. Current state:', showDatePicker);
              setShowDatePicker(!showDatePicker);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>
                {dateRangeFilter === 'past-week' ? 'Past Week'
                : dateRangeFilter === 'past-month' ? 'Past Month'
                : dateRangeFilter === 'past-3-months' ? 'Past 3 Months'
                : dateRangeFilter === 'past-6-months' ? 'Past 6 Months'
                : dateRangeFilter === 'past-year' ? 'Past Year'
                : dateRangeFilter === 'past-2-years' ? 'Past 2 Years'
                : dateRangeFilter === 'all-time' ? 'All Time'
                : dateRangeFilter === 'clear' ? 'Select Timeframe'
                : startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                : 'Select Timeframe'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md border border-gray-200 px-3 py-2">
            <label htmlFor="status-filter" className="text-sm text-gray-700 font-semibold flex items-center space-x-1 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </label>
            <StatusFilterDropdown
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setPage={setPage}
            />
          </div>
        </div>

        {showDatePicker && (
          <DateRangePicker
            onSelectRange={handleSelectRange}
            onClose={handleCloseDatePicker}
            triggerRef={datePickerTriggerRef}
          />
        )}

        <div className={`overflow-x-auto rounded-lg shadow-none mb-6 border border-gray-200 bg-white ${launches.length === 0 ? 'min-h-[500px]' : ''}`}>
          <table className={`min-w-full bg-white ${launches.length === 0 ? 'table-fixed' : ''}`}>
            <thead className="bg-white">
              <tr>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[8%]">No:</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[18%]">Launched (UTC)</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[18%]">Location</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[18%]">Mission</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[10%]">Orbit</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[15%]">Launch Status</th>
                <th className="py-4 px-4 text-left text-gray-600 uppercase font-bold text-xs w-[13%]">Rocket</th>
              </tr>
            </thead>
            {launches.length > 0 && (
              <tbody>
                {launches.map((launch) => (
                  <tr key={launch.id} onClick={() => openModal(launch)} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <td className="py-4 px-4 text-sm text-gray-700">{launch.flight_number}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{new Date(launch.date_utc).toLocaleString()}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{launch.launchpad?.name || 'N/A'}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{launch.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{launch.cores[0]?.orbit || 'N/A'}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {launch.upcoming ? (
                        <span className="px-2 py-1 rounded-sm font-semibold text-yellow-700 bg-yellow-50 text-xs">Upcoming</span>
                      ) : launch.success ? (
                        <span className="px-2 py-1 rounded-sm font-semibold text-green-700 bg-green-50 text-xs">Success</span>
                      ) : (
                        <span className="px-2 py-1 rounded-sm font-semibold text-red-700 bg-red-50 text-xs">Failed</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{launch.rocket?.name || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {launches.length === 0 && (
            <div className="flex-grow flex items-center justify-center text-base text-gray-600 text-center absolute inset-0 top-[64px]">
              <p>No results found for the specified filter</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center mt-6 border border-gray-300 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm border-r border-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              const isFirstPage = pageNumber === 1;
              const isLastPage = pageNumber === totalPages;
              const isCurrentPage = page === pageNumber;
              const isNearCurrent = Math.abs(page - pageNumber) <= 1;
              const showEllipsisBefore = pageNumber === page - 2 && page > 3;
              const showEllipsisAfter = pageNumber === page + 2 && page < totalPages - 2;

              if (isFirstPage || isLastPage || isCurrentPage || isNearCurrent) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 ${isCurrentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm border-r border-gray-300`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (showEllipsisBefore) {
                return <span key={`ellipsis-before-${pageNumber}`} className="px-3 py-1 text-gray-700 border-r border-gray-300">...</span>;
              } else if (showEllipsisAfter) {
                return <span key={`ellipsis-after-${pageNumber}`} className="px-3 py-1 text-gray-700 border-r border-gray-300">...</span>;
              }
              return null;
            })}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </main>

      <LaunchModal launch={selectedLaunch} onClose={closeModal} />
    </div>
  );
}

export default App;