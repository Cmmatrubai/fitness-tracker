import React from 'react';
import { Bar } from 'react-chartjs-2';

function Charts({ workouts }) {
  // Process data to get totals per exercise type
  const exerciseTypes = {};
  workouts.forEach(workout => {
    const type = workout.exercise_type;
    if (exerciseTypes[type]) {
      exerciseTypes[type] += workout.duration;
    } else {
      exerciseTypes[type] = workout.duration;
    }
  });

  const data = {
    labels: Object.keys(exerciseTypes),
    datasets: [
      {
        label: 'Total Duration (minutes)',
        data: Object.values(exerciseTypes),
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  };

  return (
    <div>
      <h3>Workout Summary</h3>
      <Bar data={data} />
    </div>
  );
}

export default Charts;
