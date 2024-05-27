import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

function TrainingPlanPage({ viewModel }) {
  const [workoutType, setWorkoutType] = useState('')
  const [workoutDistance, setWorkoutDistance] = useState('')
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [workoutDate, setWorkoutDate] = useState('')
  const [trainingPlan, setTrainingPlan] = useState(null)

  useEffect(() => {
    setTrainingPlan(viewModel.getTrainingPlan())
  }, [viewModel])

  const handleCreatePlan = () => {
    viewModel.createTrainingPlan()
    setTrainingPlan(viewModel.getTrainingPlan())
  }

  const handleAddWorkout = (e) => {
    e.preventDefault()
    viewModel.addWorkout(workoutType, workoutDistance, workoutDuration, workoutDate)
    setTrainingPlan(viewModel.getTrainingPlan())
    setWorkoutType('')
    setWorkoutDistance('')
    setWorkoutDuration('')
    setWorkoutDate('')
  }

  const handleDeleteWorkout = (index) => {
    viewModel.deleteWorkout(index)
    setTrainingPlan(viewModel.getTrainingPlan())
  }

  return (
    <>
      <h1>Training Plan</h1>
      {trainingPlan ? (
        <div>
          <form onSubmit={handleAddWorkout}>
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
          {trainingPlan.allMyWorkout.length > 0 ? (
            <ul>
              {trainingPlan.allMyWorkout.map((workout, index) => (
                <li key={index}>
                  <div>
                    <strong>Workout Type:</strong> {workout.type}
                  </div>
                  <div>
                    <strong>Distance:</strong> {workout.distance} km
                  </div>
                  <div>
                    <strong>Duration:</strong> {workout.duration} minutes
                  </div>
                  <div>
                    <strong>Date:</strong> {workout.date.toLocaleDateString()}
                  </div>
                  <button onClick={() => handleDeleteWorkout(index)}>Delete</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No workouts available. Please add a workout.</p>
          )}
        </div>
      ) : (
        <button onClick={handleCreatePlan}>Create Training Plan</button>
      )}
    </>
  )
}

TrainingPlanPage.propTypes = {
  viewModel: PropTypes.object.isRequired,
}

export default TrainingPlanPage