import React, { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            title: 'Çıkış yapmak istediğinize emin misiniz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Çıkış Yap',
            cancelButtonText: 'İptal Et',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Remove tokens from local storage
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                
                // Redirect to login page
                navigate('/');
            }
        });
    };

    return (
        <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
        </IconButton>
    );
};

export default Logout;
