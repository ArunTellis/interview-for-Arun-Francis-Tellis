
import { Calendar, ChevronDown } from 'lucide-react';
import DateRangePicker from './DateRangePicker';
import StatusFilterDropdown from './StatusFilterDropdown';

const Filters = ({
  statusFilter,
  setStatusFilter,
  setPage,
  showDatePicker,
  setShowDatePicker,
  datePickerRef,
  startDate,
  endDate,
  onSelectRange
}) => (
  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
    <div className="relative">
      <button
        ref={datePickerRef}
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="flex items-center gap-2 bg-white border rounded px-4 py-2 shadow hover:bg-gray-100 transition"
      >
        <Calendar size={16} />
        <span>
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
            : 'Select Timeframe'}
        </span>
        <ChevronDown size={16} />
      </button>
      {showDatePicker && (
        <DateRangePicker onSelectRange={onSelectRange} triggerRef={datePickerRef} />
      )}
    </div>

    <StatusFilterDropdown
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      setPage={setPage}
    />
  </div>
);

export default Filters;
