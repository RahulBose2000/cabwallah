import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Make the API call to logout the user
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Successful logout
          console.log('Logout successful', token);
          localStorage.removeItem('token'); // Remove token from localStorage
          navigate('/login'); // Redirect to login page
        } else {
          // If the response is not successful, handle accordingly
          console.error('Logout failed: ', response.status);
        }
      })
      .catch((error) => {
        console.error('Error during logout: ', error);
      });
    } else {
      console.error('No token found, user may already be logged out');
      navigate('/login'); // Redirect to login if there's no token
    }
  }, [token, navigate]); // Only run this effect when token or navigate changes

  return <div>Logging out...</div>;
};

export default UserLogout;
