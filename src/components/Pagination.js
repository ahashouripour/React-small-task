import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className='pagination'>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <span onClick={() => handlePageChange(currentPage)}>  {currentPage} </span>
            <span onClick={() => handlePageChange(currentPage + 1)}>  {currentPage + 1} </span>
            <span onClick={() => handlePageChange(currentPage + 2)}>  {currentPage + 2} </span>
            <span onClick={() => handlePageChange(currentPage + 3)}>  {currentPage + 3} </span>
            <span onClick={() => handlePageChange(currentPage + 4)}>  {currentPage + 4} </span>
            <span >... </span>
            <span onClick={() => handlePageChange(currentPage + 8)}>  {currentPage + 7} </span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faArrowRight} />
            </button>
        </div>
    );
};

export default Pagination;