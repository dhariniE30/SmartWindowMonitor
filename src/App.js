import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import History from './History';
import Login from './Login';
import AboutUs from './AboutUs';
import Graph from './Graph'; // Import the new Graph component
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'false'; // Check login status
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="App">
        <nav>
          <h3>Smart Window Monitor</h3>
          {isLoggedIn && ( // Show links only when logged in
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/history">History</Link></li>
              <li><Link to="/aboutus">About Us</Link></li>
              <li><Link to="/graph">Graph</Link></li> {/* New link for the Graph page */}
            </ul>
          )}
        </nav>
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <History />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/aboutus" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AboutUs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/graph" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Graph /> {/* New route for the Graph page */}
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect all other routes to login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
