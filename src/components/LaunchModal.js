import React from 'react';

const LaunchModal = ({ launch, onClose }) => {
  if (!launch) return null;

  const getLaunchStatusBadge = () => {
    if (launch.upcoming) {
      return <span className="px-2 py-1 rounded-full font-semibold text-yellow-700 bg-yellow-50 text-xs">Upcoming</span>;
    } else if (launch.success) {
      return <span className="px-2 py-1 rounded-full font-semibold text-green-700 bg-green-50 text-xs">Success</span>;
    } else {
      return <span className="px-2 py-1 rounded-full font-semibold text-red-700 bg-red-50 text-xs">Failed</span>;
    }
  };

  const payload = launch.payloads?.[0] || {};
  const rocket = launch.rocket || {};
  const launchpad = launch.launchpad || {};

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
              {getLaunchStatusBadge()}
            </div>
            <p className="text-gray-600 text-base">{rocket.name || 'N/A'}</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-6 leading-relaxed">
          {launch.details || 'No details available.'}{' '}
          {launch.links.wikipedia && (
            <a
              href={launch.links.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Wikipedia
            </a>
          )}
        </p>

        <div className="space-y-3">
          <InfoRow label="Flight Number" value={launch.flight_number} />
          <InfoRow label="Mission Name" value={launch.name} />
          <InfoRow label="Rocket Name" value={rocket.name || 'N/A'} />
          <InfoRow label="Rocket Type" value={rocket.type || 'N/A'} />
          <InfoRow label="Manufacturer" value={rocket.company || 'N/A'} />
          <InfoRow label="Nationality" value={rocket.country || 'N/A'} />
          <InfoRow label="Launch Date" value={new Date(launch.date_utc).toLocaleString()} />
          <InfoRow label="Payload Type" value={payload.type || 'N/A'} />
          <InfoRow label="Orbit" value={payload.orbit || 'N/A'} />
          <InfoRow label="Launch Site" value={launchpad.name || 'N/A'} />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200">
    <span className="text-gray-600 font-medium text-sm">{label}</span>
    <span className="text-gray-800 text-sm">{value}</span>
  </div>
);

export default LaunchModal;
