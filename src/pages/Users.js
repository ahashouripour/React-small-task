import React, { useMemo, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { DataContext } from '../context/DataContext';
import PageSizeDropdown from '../components/PageSizeDropdown';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
  const {
    users,
    setUsers,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
  } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const filteredUsers = users.filter(user => user.firstName.includes(searchTerm) || user.lastName.includes(searchTerm));
  const filteringList = ["firstName", "email", "birthDate", "gender"];
  const items = [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' },
    { name: 'maidenName', label: 'MAIDEN NAME' },
    { name: 'age', label: 'AGE' },
    { name: 'gender', label: 'GENDER' },
    { name: 'email', label: 'EMAIL' },
    { name: 'phone', label: 'PHONE' },
    { name: 'username', label: 'USERNAME' },
    { name: 'birthDate', label: 'BIRTH DATE' },
    { name: 'bloodGroup', label: 'BLOODGROUP' },
    { name: 'eyeColor', label: 'EYECOLOR' },
    { name: 'height', label: 'HEIGHT' },
  ];
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    firstName: "",
    email: "",
    birthDate: "",
    gender: "",
  });

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppliedFilters({ ...appliedFilters, [name]: value });
    event.target.value = '';
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleInputChange, 500);
  }, []);

  const renderSearchBox = (filter) => {
    return (
      <div key={filter} className={`box ${activeFilter === filter ? 'active' : ''}`}>
        <input
          type="text"
          placeholder={filter}
          onChange={debouncedResults}
          name={filter}
          hidden={activeFilter !== filter}
        />
        <button onClick={() => { handleFilterClick(filter); }}>{filter}&nbsp;
          <FontAwesomeIcon icon={faCaretDown} size="xs" />
        </button>
      </div>
    );
  };

  const tableBody = filteredUsers.map((user, index) => (
    <tr key={user.id} className={index === 0 ? 'gray-row' : ''}>
        {items.map(item => (
            <td key={item.name}>{user[item.name]}</td>
        ))}
    </tr>
));

  const getUrlParams = (params) => {
    let urlParams = ``;
    Object.entries(params).forEach(item => {
      if (item[1]) { urlParams += "key=" + item[0] + "&value=" + item[1] + "&" }
    })
    return urlParams;
  }

  const getUrl = (filters, pageSize, currentPage) => {

    let apiEndpoint = `https://dummyjson.com/users?`;
    let condition = `limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;
    const urlParams = getUrlParams(filters)

    if (urlParams) {
      apiEndpoint = `https://dummyjson.com/users/filter?` + urlParams;
    }
    return apiEndpoint + condition;
  };

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / pageSize));

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const url = getUrl(appliedFilters, pageSize, currentPage)
    fetchData(url)
  }, [appliedFilters, pageSize, currentPage, setUsers]);

  return (
    <div>
      <div className='header-nav'>
        <a href='/'>Home</a>
        <span className='shadow'>&nbsp;/&nbsp;Users</span>
      </div>
      <div className="search-box">
        <div className='box'>
          <PageSizeDropdown pageSize={pageSize} setPageSize={setPageSize} />
        </div>
        <div className='boarder-shadow'>
          {isSearchOpen ? (
            <div className="search-box">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          ) : (
            <button className="box" onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          )}
        </div>
        <div className='search-box'>
          {filteringList.map(renderSearchBox)}
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {items.map(item => (
                <th key={item.name}>{item.label || item.name}</th> 
              ))}
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </table>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default Users;