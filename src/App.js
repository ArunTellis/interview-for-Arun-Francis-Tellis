import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import LaunchTable from './components/LaunchTable';
import Pagination from './components/Pagination';
import LaunchModal from './components/LaunchModal';

function App() {
  const [launches, setLaunches] = useState([]);
  const [pads, setPads] = useState({});
  const [rockets, setRockets] = useState({});
  const [payloadsFull, setPayloadsFull] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLaunch, setSelectedLaunch] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const launchesPerPage = 10;
  const datePickerRef = useRef(null);

  useEffect(() => {
    const fetchSupportingData = async () => {
      try {
        const [pRes, rRes, payRes] = await Promise.all([
          fetch('https://api.spacexdata.com/v4/launchpads'),
          fetch('https://api.spacexdata.com/v4/rockets'),
          fetch('https://api.spacexdata.com/v4/payloads'),
        ]);

        if (!pRes.ok || !rRes.ok || !payRes.ok) {
          throw new Error('One of the supporting SpaceX APIs failed');
        }

        const [pData, rData, payData] = await Promise.all([
          pRes.json(), rRes.json(), payRes.json()
        ]);

        const padsMap = Object.fromEntries(pData.map(p => [p.id, p]));
        const rocketsMap = Object.fromEntries(rData.map(r => [r.id, r]));
        const payloadsMap = Object.fromEntries(payData.map(pl => [pl.id, pl]));

        setPads(padsMap);
        setRockets(rocketsMap);
        setPayloadsFull(payloadsMap);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };

    fetchSupportingData();
  }, []);

  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      setError(null);

      try {
        let queryBody = {
          query: {},
          options: {
            limit: launchesPerPage,
            page,
            sort: { flight_number: 'asc' },
          }
        };

        if (statusFilter === 'upcoming') {
          queryBody.query.upcoming = true;
          queryBody.options.sort = { date_unix: 'asc' };
        } else if (statusFilter === 'past') {
          queryBody.query.upcoming = false;
        } else if (statusFilter === 'successful') {
          queryBody.query.success = true;
        } else if (statusFilter === 'failed') {
          queryBody.query.success = false;
        }

        if (startDate && endDate) {
          queryBody.query.date_utc = {
            $gte: startDate.toISOString(),
            $lte: endDate.toISOString()
          };
        }

        const response = await fetch('https://api.spacexdata.com/v4/launches/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(queryBody)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        setLaunches(data.docs);
        setTotalPages(data.totalPages);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [statusFilter, startDate, endDate, page]);

  const openModal = (launch) => {
    const enrichedLaunch = {
      ...launch,
      rocket: rockets[launch.rocket] || {},
      launchpad: pads[launch.launchpad] || {},
      payloads: [payloadsFull[launch.payloads?.[0]] || {}],
    };
    setSelectedLaunch(enrichedLaunch);
  };

  const closeModal = () => setSelectedLaunch(null);

  const handleSelectRange = ({ start, end }) => {
    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setPage(newPage);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading launches...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error.message}</div>;

  return (
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <Filters {...{ statusFilter, setStatusFilter, setPage, showDatePicker, setShowDatePicker, datePickerRef, startDate, endDate, onSelectRange: handleSelectRange }} />
          <LaunchTable {...{ launches, pads, rockets, payloadsFull, onRowClick: openModal }} />
          <Pagination {...{ page, totalPages, onPageChange: handlePageChange }} />
        </main>
        <LaunchModal launch={selectedLaunch} onClose={closeModal} />
      </div>
    );
}

export default App;
