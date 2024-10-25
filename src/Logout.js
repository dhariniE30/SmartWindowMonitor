// src/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Clear the auth flag
    navigate('/login'); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
