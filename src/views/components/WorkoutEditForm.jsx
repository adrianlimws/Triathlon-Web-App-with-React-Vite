import React, { useState } from 'react'
import PropTypes from 'prop-types'


function WorkoutEditForm({ workout, onSubmit, onCancel, onRevertChanges }) {
    const [workoutType, setWorkoutType] = useState(workout.type)
    const [workoutDistance, setWorkoutDistance] = useState(workout.distance)
    const [workoutDuration, setWorkoutDuration] = useState(workout.duration)
    const [workoutDate, setWorkoutDate] = useState(workout.date.toISOString().slice(0, 10))
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onSubmit(workoutType, workoutDistance, workoutDuration, workoutDate)
    }
  
    return (
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={onRevertChanges}>Revert Changes</button>
        <button type="submit">Update Workout</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    )
  }

  WorkoutEditForm.propTypes = {
    workout: PropTypes.shape({
      type: PropTypes.string.isRequired,
      distance: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
    onRevertChanges: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  export default WorkoutEditForm