// src/components/ProtectedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import {isAdmin} from '../utils/tokenUtils'

const adminRoute = ({ element }) => {
    const isLoggedIn = !!localStorage.getItem('accessToken');

    return isLoggedIn && isAdmin() ? element : <Navigate to="/home" />;
};

export default adminRoute;