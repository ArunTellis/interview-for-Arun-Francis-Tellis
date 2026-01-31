
const LaunchTable = ({ launches, pads, rockets, payloadsFull, onRowClick }) => (
    <div className="bg-white border rounded shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left px-4 py-3">No</th>
            <th className="text-left px-4 py-3">Launched</th>
            <th className="text-left px-4 py-3">Location</th>
            <th className="text-left px-4 py-3">Mission</th>
            <th className="text-left px-4 py-3">Orbit</th>
            <th className="text-left px-4 py-3">Status</th>
            <th className="text-left px-4 py-3">Rocket</th>
          </tr>
        </thead>
        <tbody>
          {launches.length > 0 ? (
            launches.map((launch) => {
              const orbit = payloadsFull[launch.payloads?.[0]]?.orbit || 'N/A';
              const rocketName = rockets[launch.rocket]?.name || 'N/A';
              const padName = pads[launch.launchpad]?.name || 'N/A';
  
              return (
                <tr key={launch.id} onClick={() => onRowClick(launch)} className="hover:bg-gray-50 cursor-pointer border-t">
                  <td className="px-4 py-3">{launch.flight_number}</td>
                  <td className="px-4 py-3">{new Date(launch.date_utc).toLocaleString()}</td>
                  <td className="px-4 py-3">{padName}</td>
                  <td className="px-4 py-3">{launch.name}</td>
                  <td className="px-4 py-3">{orbit}</td>
                  <td className="px-4 py-3">
                    {launch.upcoming ? (
                      <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs font-semibold">Upcoming</span>
                    ) : launch.success ? (
                      <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold">Success</span>
                    ) : (
                      <span className="text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-semibold">Failed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{rocketName}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-6">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  
  export default LaunchTable;
  