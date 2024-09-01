import React, { useMemo, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { DataContext } from '../context/DataContext';
import PageSizeDropdown from '../components/PageSizeDropdown';
import Pagination from '../components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faSearch } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
    const { products, setProducts, pageSize, setPageSize, searchTerm, setSearchTerm } = useContext(DataContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);
    const filteredProducts = products.filter(product => product.title.includes(searchTerm) || product.brand.includes(searchTerm));
    const categories = ["all", "laptops"];
    const [selectedCategory, setSelectedCategory] = useState("");
    const items = [
        { name: 'title', label: 'Title' },
        { name: 'category', label: 'Category' },
        { name: 'price', label: 'Price' },
        { name: 'discountPercentage', label: 'Discount Percentage' },
        { name: 'rating', label: 'Rating' },
        { name: 'stock', label: 'Stock' },
        { name: 'brand', label: 'Brand' },
        { name: 'sku', label: 'sku' },
        { name: 'weight', label: 'weight' }
    ];
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({
        title: "",
        brand: "",
        all: "",
        laptops: "",
    });
    const areAllFiltersEmpty = () => {
        return Object.values(appliedFilters).every(value => value === "" || value === undefined);
    };
    const tableBody = filteredProducts.map((product, index) => (
        <tr key={product.id} className={index === 0 ? 'gray-row' : ''}>
            {items.map(item => (
                <td key={item.name}>{product[item.name]}</td>
            ))}
        </tr>
    ));
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

    const fetchData = async (url) => {
        setIsLoading(true);
        try {
            const response = await axios.get(url);
            setProducts(response.data.products);
            setTotalPages(Math.ceil(response.data.total / pageSize));

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBrandData = async (url, filter) => {
        setIsLoading(true);
        try {
            const response = await axios.get(url);
            const brandProdusts = response.data.products;
            let checkBrands = (product) => {
                return product.brand === filter
            }
            setProducts(brandProdusts.filter(checkBrands));
            setTotalPages(Math.ceil(response.data.total / pageSize));

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        let url;
        if (areAllFiltersEmpty()) {
            url = `https://dummyjson.com/products?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`
            fetchData(url)
        } else {
            Object.entries(appliedFilters).forEach(item => {
                if (item[1]) {
                    if (item[0] === 'brand') {
                        url = `https://dummyjson.com/products?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`
                        fetchBrandData(url, item[1])
                    } else if (item[0] === 'title') {
                        url = `https://dummyjson.com/products/search?q=${item[1]}&limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;
                        fetchData(url)
                    } else if (item[1] === 'all') {
                        url = `https://dummyjson.com/products?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`
                        fetchData(url)
                    } else if (item[1] === 'laptops') {
                        url = `https://dummyjson.com/products/category/${item[1]}?limit=${pageSize}&skip=${(currentPage - 1) * pageSize}`;
                        fetchData(url)
                    }
                }

            })
        }

    }, [appliedFilters, pageSize, currentPage, setProducts]);
    return (
        <div>
            <div className='header-nav'>
                <a href='/'>Home</a>
                <span className='shadow'>&nbsp;/&nbsp;Products</span>
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
                    <div key={'title'} className={`box ${activeFilter === 'title' ? 'active' : ''}`}>
                        <input
                            type="text"
                            placeholder={'title'}
                            onChange={debouncedResults}
                            name={'title'}
                            hidden={activeFilter !== 'title'}
                        />
                        <button onClick={() => { handleFilterClick('title'); }}>{'title'}&nbsp;
                            <FontAwesomeIcon icon={faCaretDown} size="xs" />
                        </button>
                    </div>
                    <div key={'brand'} className={`box ${activeFilter === 'brand' ? 'active' : ''}`}>
                        <input
                            type="text"
                            placeholder={'brand'}
                            onChange={debouncedResults}
                            name={'brand'}
                            hidden={activeFilter !== 'brand'}
                        />
                        <button onClick={() => { handleFilterClick('brand'); }}>{'brand'}&nbsp;
                            <FontAwesomeIcon icon={faCaretDown} size="xs" />
                        </button>
                    </div>
                    <div className={`box`}>
                        <select className={`box`}
                            id="category-select"
                            value={selectedCategory}
                            onChange={handleInputChange}
                        >
                            <option value="">Category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
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

export default Products;