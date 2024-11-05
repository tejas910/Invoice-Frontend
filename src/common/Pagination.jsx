import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3; // Number of pages to show before and after the current page
    let startPage, endPage;

    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages based on current page
      if (currentPage <= maxVisiblePages) {
        startPage = 1;
        endPage = Math.min(5, totalPages);
      } else if (currentPage + maxVisiblePages >= totalPages) {
        startPage = Math.max(totalPages - 4, 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - maxVisiblePages;
        endPage = currentPage + maxVisiblePages;
      }
    }

    // Add first page button
    if (startPage > 1) {
      pageNumbers.push(
        <li key="first">
          <button onClick={() => handlePageChange(1)} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
            First
          </button>
        </li>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis-start" className="mx-2">...</span>);
      }
    }

    // Add individual page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button 
            onClick={() => handlePageChange(i)} 
            disabled={currentPage === i}
            className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis-end" className="mx-2">...</span>);
      }
      pageNumbers.push(
        <li key="last">
          <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
            Last
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <nav aria-label="Pagination navigation">
      <ul className="flex justify-center space-x-2 mt-4">
        {renderPageNumbers()}
      </ul>
    </nav>
  );
};

export default Pagination;