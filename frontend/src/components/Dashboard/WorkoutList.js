import React from 'react';

function WorkoutList({ workouts }) {
  return (
    <div>
      <h3>Your Workouts</h3>
      <ul className="list-group">
        {workouts.map(workout => (
          <li key={workout.id} className="list-group-item">
            <strong>{workout.exercise_type}</strong> on {new Date(workout.date).toLocaleDateString()} - {workout.duration} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WorkoutList;
