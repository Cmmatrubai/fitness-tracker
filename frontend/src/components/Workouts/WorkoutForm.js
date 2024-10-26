import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function WorkoutForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    exercise_type: '',
    duration: '',
    details: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/workouts', formData)
      .then(res => {
        alert('Workout added successfully!');
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        alert('Error adding workout. Please try again.');
      });
  };

  return (
    <div className="container">
      <h2>Add Workout</h2>
      <form onSubmit={handleSubmit}>
        {/* Date */}
        <div className="mb-3">
          <label>Date:</label>
          <input type="date" name="date" className="form-control" onChange={handleChange} required />
        </div>
        {/* Exercise Type */}
        <div className="mb-3">
          <label>Exercise Type:</label>
          <input type="text" name="exercise_type" className="form-control" onChange={handleChange} required />
        </div>
        {/* Duration */}
        <div className="mb-3">
          <label>Duration (minutes):</label>
          <input type="number" name="duration" className="form-control" onChange={handleChange} required />
        </div>
        {/* Details */}
        <div className="mb-3">
          <label>Details:</label>
          <input type="text" name="details" className="form-control" onChange={handleChange} />
        </div>
        {/* Notes */}
        <div className="mb-3">
          <label>Notes:</label>
          <textarea name="notes" className="form-control" onChange={handleChange}></textarea>
        </div>
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">Add Workout</button>
      </form>
    </div>
  );
}

export default WorkoutForm;
