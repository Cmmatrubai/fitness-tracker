import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function WorkoutDetail() {
  const { id } = useParams(); // Get the workout ID from the URL
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    exercise_type: '',
    duration: '',
    details: '',
    notes: ''
  });

  useEffect(() => {
    // Fetch the workout details
    api.get(`/workouts/${id}`)
      .then(res => {
        setWorkout(res.data);
        setFormData({
          date: res.data.date.split('T')[0], // Format date
          exercise_type: res.data.exercise_type,
          duration: res.data.duration,
          details: res.data.details,
          notes: res.data.notes
        });
      })
      .catch(err => {
        console.error(err);
        alert('Error fetching workout details.');
        navigate('/dashboard');
      });
  }, [id, navigate]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      api.delete(`/workouts/${id}`)
        .then(() => {
          alert('Workout deleted successfully.');
          navigate('/dashboard');
        })
        .catch(err => {
          console.error(err);
          alert('Error deleting workout.');
        });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    api.put(`/workouts/${id}`, formData)
      .then(() => {
        alert('Workout updated successfully.');
        setIsEditing(false);
        setWorkout({ ...workout, ...formData });
      })
      .catch(err => {
        console.error(err);
        alert('Error updating workout.');
      });
  };

  if (!workout) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Workout Details</h2>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          {/* Date */}
          <div className="mb-3">
            <label>Date:</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>
          {/* Exercise Type */}
          <div className="mb-3">
            <label>Exercise Type:</label>
            <input type="text" name="exercise_type" className="form-control" value={formData.exercise_type} onChange={handleChange} required />
          </div>
          {/* Duration */}
          <div className="mb-3">
            <label>Duration (minutes):</label>
            <input type="number" name="duration" className="form-control" value={formData.duration} onChange={handleChange} required />
          </div>
          {/* Details */}
          <div className="mb-3">
            <label>Details:</label>
            <input type="text" name="details" className="form-control" value={formData.details} onChange={handleChange} />
          </div>
          {/* Notes */}
          <div className="mb-3">
            <label>Notes:</label>
            <textarea name="notes" className="form-control" value={formData.notes} onChange={handleChange}></textarea>
          </div>
          {/* Buttons */}
          <button type="submit" className="btn btn-primary me-2">Update Workout</button>
          <button type="button" className="btn btn-secondary" onClick={handleEditToggle}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
          <p><strong>Exercise Type:</strong> {workout.exercise_type}</p>
          <p><strong>Duration:</strong> {workout.duration} minutes</p>
          <p><strong>Details:</strong> {workout.details}</p>
          <p><strong>Notes:</strong> {workout.notes}</p>
          {/* Action Buttons */}
          <button className="btn btn-primary me-2" onClick={handleEditToggle}>Edit</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default WorkoutDetail;
