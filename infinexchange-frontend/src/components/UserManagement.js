import React, { useEffect, useState } from 'react';
import userService from '../services/userService';
import './UserManagement.css';
import Home from './Home';
import { getUserIdFromToken } from '../utils/tokenUtils';

const UserManagement = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setError('No token found');
        return;
      }

      const userId = getUserIdFromToken(token);

      if (!userId) {
        setError('Failed to retrieve user ID from token');
        return;
      }

      try {
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Failed to fetch user');
      }
    };

    fetchUser();
  }, []);

  return (
    <Home>
      <div className="user-details-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {user ? (
          <>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png" 
              alt="User Icon" 
              className="user-icon" 
            />
            <div className="user-details">
              <p><strong>Personel Numarası:</strong> {user.id}</p>
              <p><strong>Kullanıcı Adı:</strong> {user.username}</p>
              <p><strong>Ad:</strong> {user.firstName}</p>
              <p><strong>Soyad:</strong> {user.lastName}</p>
              <p><strong>Yetki Seviyesi:</strong> {user.role}</p>
              <p><strong>E-mail:</strong> {user.email}</p>
              <p><strong>Oluşturma Tarihi:</strong> {new Date(user.createdDate).toLocaleDateString()}</p>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Home>
  );
};

export default UserManagement;
