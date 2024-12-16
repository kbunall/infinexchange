// src/components/Dashboard.js
import React from 'react';
import Logout from './Logout';
import CurrencyList from './CurrencyList';
const Dashboard = () => {
    return (
        <div>
            <h1>Hoş Geldiniz!</h1>
            <p>Bu, İnFina Akademi.</p>
            <CurrencyList></CurrencyList>
            <Logout></Logout>
        </div>
    );
};

export default Dashboard;
