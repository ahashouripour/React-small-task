import React from 'react';

const PageSizeDropdown = ({ pageSize, setPageSize }) => {
    const options = [5, 10, 20, 50];

    const handleChange = (event) => {
        setPageSize(Number(event.target.value));
    };

    return (
        <div className='box'>
            <select id="pageSize"  value={pageSize} onChange={handleChange}>
                {options.map(size => (
                    <option key={size} value={size}>{size}</option>
                ))}
            </select>
            <label htmlFor="pageSize">Entries</label>
        </div>
    );
};

export default PageSizeDropdown;
