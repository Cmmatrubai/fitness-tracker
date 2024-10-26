import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import WorkoutList from './WorkoutList';
import Charts from './Charts';

function Dashboard() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    api.get('/workouts')
      .then(res => {
        setWorkouts(res.data);
      })
      .catch(err => {
        console.error(err);
        alert('Error fetching workouts.');
      });
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <Charts workouts={workouts} />
      <WorkoutList workouts={workouts} />
    </div>
  );
}

export default Dashboard;
