const Pagination = ({ page, totalPages, onPageChange }) => {
    const renderPages = () => {
      const pages = [];
  
      const addPage = (p) => {
        pages.push(
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 text-sm ${
              page === p ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        );
      };
  
      const addEllipsis = (key) => {
        pages.push(
          <span key={key} className="px-3 py-1 text-gray-500">
            ...
          </span>
        );
      };
  
      if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) addPage(i);
      } else {
        addPage(1);
        addPage(2);
  
        if (page > 4) addEllipsis('start');
  
        for (let i = page - 1; i <= page + 1; i++) {
          if (i > 2 && i < totalPages) addPage(i);
        }
  
        if (page < totalPages - 1) addEllipsis('end');
  
        addPage(totalPages);
      }
  
      return pages;
    };
  
    return (
      <div className="flex justify-end mt-6">
        <nav className="inline-flex items-center bg-white border border-gray-300 rounded-md shadow-sm divide-x divide-gray-300 overflow-hidden">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 text-gray-600 disabled:text-gray-400 hover:bg-gray-100"
          >
            &lt;
          </button>
  
          {renderPages()}
  
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 text-gray-600 disabled:text-gray-400 hover:bg-gray-100"
          >
            &gt;
          </button>
        </nav>
      </div>
    );
  };
  
  export default Pagination;
  