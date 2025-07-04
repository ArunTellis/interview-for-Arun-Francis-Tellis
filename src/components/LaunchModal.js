import React from 'react';

const LaunchModal = ({ launch, onClose }) => {
  if (!launch) {
    return null;
  }

  const getLaunchStatusBadge = (launch) => {
    if (launch.upcoming) {
      return <span className="px-2 py-1 rounded-full font-semibold text-yellow-700 bg-yellow-50 text-xs">Upcoming</span>;
    } else if (launch.success) {
      return <span className="px-2 py-1 rounded-full font-semibold text-green-700 bg-green-50 text-xs">Success</span>;
    } else {
      return <span className="px-2 py-1 rounded-full font-semibold text-red-700 bg-red-50 text-xs">Failed</span>;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl mx-auto relative" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="flex items-center mb-6">
          {launch.links.patch.small && (
            <img src={launch.links.patch.small} alt="Mission Patch" className="h-20 w-20 object-contain mr-4" />
          )}
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-2xl font-bold text-gray-800 mr-2">{launch.name}</h2>
              {getLaunchStatusBadge(launch)}
            </div>
            <p className="text-gray-600 text-base">{launch.rocket?.name || 'N/A'}</p>
            <div className="flex space-x-3 mt-2">
              {launch.links.wikipedia && (
                <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                </a>
              )}
              {launch.links.article && (
                <a href={launch.links.article} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4zm2 2a1 1 0 100 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-6 leading-relaxed">
          {launch.details || 'No details available.'}{' '}
          {launch.links.wikipedia && (
            <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Wikipedia</a>
          )}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Flight Number</span>
            <span className="text-gray-800 text-sm">{launch.flight_number}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Mission Name</span>
            <span className="text-gray-800 text-sm">{launch.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Rocket Type</span>
            <span className="text-gray-800 text-sm">{launch.rocket?.type || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Rocket Name</span>
            <span className="text-gray-800 text-sm">{launch.rocket?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Manufacturer</span>
            <span className="text-gray-800 text-sm">{launch.rocket?.company || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Nationality</span>
            <span className="text-gray-800 text-sm">{launch.rocket?.country || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Launch Date</span>
            <span className="text-gray-800 text-sm">{new Date(launch.date_utc).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Payload Type</span>
            <span className="text-gray-800 text-sm">{launch.payloads?.[0]?.type || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium text-sm">Orbit</span>
            <span className="text-gray-800 text-sm">{launch.cores?.[0]?.orbit || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2"> {/* No border-b for the last item */}
            <span className="text-gray-600 font-medium text-sm">Launch Site</span>
            <span className="text-gray-800 text-sm">{launch.launchpad?.name || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchModal; 