import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import WorkoutForm from './components/Workouts/WorkoutForm';
import Profile from './components/Profile/Profile';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar/Navbar';
import WorkoutDetail from './components/Workouts/WorkoutDetail';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute isAuthenticated={isAuthenticated}><Dashboard /></PrivateRoute>} />
        <Route path="/add-workout" element={<PrivateRoute isAuthenticated={isAuthenticated}><WorkoutForm /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute isAuthenticated={isAuthenticated}><Profile /></PrivateRoute>} />
        <Route path="/workouts/:id" element={<PrivateRoute isAuthenticated={isAuthenticated}><WorkoutDetail /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
