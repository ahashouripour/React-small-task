import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [emailSearchTerm, setEmailSearchTerm] = useState('');
    const [birthDateSearchTerm, setBirthDateSearchTerm] = useState('');
    const [genderSearchTerm, setGenderSearchTerm] = useState('');

    return (
        <DataContext.Provider value={{ 
            users, setUsers, 
            products, setProducts, 
            pageSize, setPageSize, 
            searchTerm, setSearchTerm,
            emailSearchTerm, setEmailSearchTerm,
            birthDateSearchTerm, setBirthDateSearchTerm,
            genderSearchTerm, setGenderSearchTerm
             }}>
            {children}
        </DataContext.Provider>
    );
};