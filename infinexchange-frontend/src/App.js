// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';

import MainPage from './components/MainPage';
import Trade from './components/Trade';
import Home from './components/Home';
import UserManagement from './components/UserManagement';
import DefiningCurrencies from './components/DefiningCurrencies'; 
import CustomerPage from './pages/CustomerPage/'
import EmployeePage from './pages/EmployeePage/'
import LoginPage from './pages/LoginPage/'
import ForgotPasswordPage from './pages/ForgotPasswordPage/'
import NewPasswordPage from './pages/NewPasswordPage/'
import CustomerTransactionPage from './components/CustomerTransactionPage';
import PortfolioPage from './pages/PortfolioPage/index';
import StockPage from './components/StockPage';
import CurrencyClosingPrices from './components/CurrencyClosingPrices'
import CurrencyList from './components/CurrencyList';

const App = () => {
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset" element={<NewPasswordPage />} />
                    <Route 
                        path="/stock"
                        element={<PrivateRoute element={<StockPage />} />}
                    />
                    <Route 
                        path="/users"
                        element={<PrivateRoute element={<UserManagement />} />}
                    />
                    <Route
                        path="/home"
                        element={<PrivateRoute element={<Home> <MainPage></MainPage></Home>} />}
                    />
                    <Route 
                        path="/trade"
                        element={<PrivateRoute element={<Trade />} />}
                    />
                    <Route 
                        path="/employee"
                        element={<ProtectedRoute element={<EmployeePage />} /> }
                    />
                    <Route 
                        path="/customer"
                        element={<PrivateRoute element={<CustomerPage />} /> }
                    />
                    <Route 
                        path='/nakit'
                        element={<PrivateRoute  element={<CustomerTransactionPage/>} /> }
                    />
                    <Route 
                        path='/definingcurrencies'
                        element={<PrivateRoute element={<DefiningCurrencies/>} /> }
                    />
                    <Route
                        path='/currencyExchange'
                        element={<PrivateRoute element= {<CurrencyList></CurrencyList>} />}
                    />
                    <Route
                        path="/portfolio"
                        element={<PrivateRoute element={<PortfolioPage />} /> }
                    />
                    <Route
                        path="/portfolio/:id"
                        element={<PrivateRoute element={<PortfolioPage />} /> }
                    />
                </Routes>
            </Router>

    );
};

export default App;
