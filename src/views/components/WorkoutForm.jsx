import React from 'react'
import PropTypes from 'prop-types'

function WorkoutForm({ onSubmit, error, workoutType, setWorkoutType, workoutDistance, setWorkoutDistance, workoutDuration, setWorkoutDuration, workoutDate, setWorkoutDate }) {
  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select
        value={workoutType}
        onChange={(e) => setWorkoutType(e.target.value)}
      >
        <option value="">Select Workout Type</option>
        <option value="running">Running</option>
        <option value="swimming">Swimming</option>
        <option value="cycling">Cycling</option>
      </select>
      <input
        type="number"
        min="1"
        placeholder="Distance (km)"
        value={workoutDistance}
        onChange={(e) => setWorkoutDistance(e.target.value)}
      />
      <input
        type="number"
        min="1"
        placeholder="Duration (minutes)"
        value={workoutDuration}
        onChange={(e) => setWorkoutDuration(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date"
        value={workoutDate}
        onChange={(e) => setWorkoutDate(e.target.value)}
      />
      <button type="submit">Add Workout</button>
    </form>
  )
}

WorkoutForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  workoutType: PropTypes.string.isRequired,
  setWorkoutType: PropTypes.func.isRequired,
  workoutDistance: PropTypes.string.isRequired,
  setWorkoutDistance: PropTypes.func.isRequired,
  workoutDuration: PropTypes.string.isRequired,
  setWorkoutDuration: PropTypes.func.isRequired,
  workoutDate: PropTypes.string.isRequired,
  setWorkoutDate: PropTypes.func.isRequired,
}

export default WorkoutForm