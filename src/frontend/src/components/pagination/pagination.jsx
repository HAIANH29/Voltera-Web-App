import React from "react";
import "./pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (currentPage > 1) {
    pages.push(
      <button
        key="prev"
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
    );
  }

  if (startPage > 1) {
    pages.push(
      <button
        key={1}
        className="pagination-btn"
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis1" className="pagination-ellipsis">
          ...
        </span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        className={`pagination-btn ${i === currentPage ? "active" : ""}`}
        onClick={() => onPageChange(i)}
      >
        {i}
      </button>
    );
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="pagination-ellipsis">
          ...
        </span>
      );
    }
    pages.push(
      <button
        key={totalPages}
        className="pagination-btn"
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    );
  }

  if (currentPage < totalPages) {
    pages.push(
      <button
        key="next"
        className="pagination-btn pagination-nav"
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    );
  }

  return (
    <div className="pagination">
      {pages}
    </div>
  );
};

export default Pagination;