import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/signup', formData)
      .then(res => {
        alert(res.data.message);
        navigate('/');
      })
      .catch(err => {
        console.error(err);
        alert('Error signing up. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-3">
          <label>Username:</label>
          <input type="text" name="username" className="form-control" onChange={handleChange} required />
        </div>
        {/* Email */}
        <div className="mb-3">
          <label>Email:</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>
        {/* Password */}
        <div className="mb-3">
          <label>Password:</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
