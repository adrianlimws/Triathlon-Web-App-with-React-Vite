import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import WorkoutForm from './components/WorkoutForm'
import WorkoutList from './components/WorkoutList'
import WorkoutEditForm from './components/WorkoutEditForm'
import Workout from '../models/workout'
import TotalMetrics from './components/TotalMetrics';
import TrainingPlan from '../models/trainingplan'

function TrainingPlanPage({ viewModel }) {
    const [workoutType, setWorkoutType] = useState('run')
    const [workoutDistance, setWorkoutDistance] = useState('5')
    const [workoutDuration, setWorkoutDuration] = useState('30')
    const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().slice(0, 10))
    const [trainingPlan, setTrainingPlan] = useState(null)
    const [error, setError] = useState('')
    const [sortCriteria, setSortCriteria] = useState('date')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [editedWorkout, setEditedWorkout] = useState(null)
    const [editedWorkoutIndex, setEditedWorkoutIndex] = useState(null)
    const [originalWorkout, setOriginalWorkout] = useState(null)

  useEffect(() => {
    setTrainingPlan(viewModel.getTrainingPlan())
  }, [viewModel])

  const handleCreatePlan = () => {
    viewModel.createTrainingPlan()
    setTrainingPlan(viewModel.getTrainingPlan())
  }

  const handleAddWorkout = (e) => {
    e.preventDefault()
    if (!workoutType) {
      setError('Please select a workout type')
      return
    }
    if (!workoutDistance || !workoutDuration || !workoutDate) {
      setError('Please fill in all the workout details')
      return
    }
    try {
      viewModel.addWorkout(workoutType, workoutDistance, workoutDuration, workoutDate)
      setTrainingPlan(viewModel.getTrainingPlan())
      setWorkoutType('')
      setWorkoutDistance('')
      setWorkoutDuration('')
      setWorkoutDate('')
      setError('')
    } catch (err) {
      setError('An error occurred while adding the workout')
    }
  }

  const handleDeleteWorkout = (workoutToDelete) => {
    try {
      viewModel.deleteWorkout(workoutToDelete);
      const updatedWorkouts = trainingPlan.allMyWorkout.filter(
        (workout) => workout !== workoutToDelete
      );
      setTrainingPlan({ ...trainingPlan, allMyWorkout: updatedWorkouts });
    } catch (err) {
      setError('An error occurred while deleting the workout');
    }
  };
  
  const handleSortChange = (e) => {
    setSortCriteria(e.target.value)
  }

  const sortedWorkouts = trainingPlan ? [...trainingPlan.allMyWorkout] : []
  sortedWorkouts.sort((a, b) => {
    switch (sortCriteria) {
      case 'date':
        return a.date - b.date
      case 'distance':
        return a.distance - b.distance
      case 'duration':
        return a.duration - b.duration
      default:
        return 0
    }
  })

  const handleSearchInputChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setSearchPerformed(false)
  }

  const handleSearch = () => {
    setSearchPerformed(true)
  }

  const filteredWorkouts = useMemo(() => {
    if (searchQuery.trim() === '') {
      return sortedWorkouts
    }
    return sortedWorkouts.filter((workout) =>
      workout.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, sortedWorkouts])


  const handleUpdateWorkout = (workoutType, workoutDistance, workoutDuration, workoutDate) => {
    try {
      const updatedWorkout = new Workout(
        workoutType,
        parseFloat(workoutDistance),
        parseInt(workoutDuration),
        new Date(workoutDate)
      )
      viewModel.updateWorkout(editedWorkoutIndex, updatedWorkout)
      setTrainingPlan(viewModel.getTrainingPlan())
      setEditedWorkout(null)
      setEditedWorkoutIndex(null)
      setOriginalWorkout({ ...updatedWorkout }) // Store the updated workout details
    } catch (err) {
      setError('An error occurred while updating the workout')
    }
  }
  
  const handleCancelEdit = () => {
    setEditedWorkout(null)
    setEditedWorkoutIndex(null)
    setOriginalWorkout(null) // Reset the originalWorkout state
  }

  const handleEditWorkout = (workout, index) => {
    if (originalWorkout) {
      setEditedWorkout({ ...originalWorkout })
    } else {
      setEditedWorkout({ ...workout })
    }
    setEditedWorkoutIndex(index)
  }
  
  const handleRevertChanges = () => {
    if (originalWorkout) {
      setEditedWorkout({ ...originalWorkout })
    }
  }

  const handleSavePlan = () => {
    viewModel.saveToLocalStorage()
    console.log('Training plan saved to localStorage')
  }

  const handleLoadPlan = () => {
    try {
      const loadedPlan = viewModel.loadFromLocalStorage()
      if (loadedPlan) {
        const newTrainingPlan = new TrainingPlan()
        newTrainingPlan.allMyWorkout = loadedPlan.workouts.map((workout) => new Workout(
          workout.type,
          workout.distance,
          workout.duration,
          new Date(workout.date)
        ))
        setTrainingPlan(newTrainingPlan);
        console.log('Training plan loaded from localStorage')
      } else {
        console.log('No saved training plan found in localStorage')
      }
    } catch (error) {
      console.error('Error loading training plan from localStorage:', error)
    }
  }
  

  return (
    <>
{trainingPlan ? (
      <>
        <h1>Training Plan</h1>
        {editedWorkout ? (
            <WorkoutEditForm
                workout={editedWorkout}
                onSubmit={handleUpdateWorkout}
                onCancel={handleCancelEdit}
                onRevertChanges={handleRevertChanges}
            />
            ) : (
            <WorkoutForm
                onSubmit={handleAddWorkout}
                error={error}
                workoutType={workoutType}
                setWorkoutType={setWorkoutType}
                workoutDistance={workoutDistance}
                setWorkoutDistance={setWorkoutDistance}
                workoutDuration={workoutDuration}
                setWorkoutDuration={setWorkoutDuration}
                workoutDate={workoutDate}
                setWorkoutDate={setWorkoutDate}
            />
            )}
          <div>
          <label htmlFor="sortCriteria">Sort by:</label>
            <select id="sortCriteria" value={sortCriteria} onChange={handleSortChange}>
                <option value="date">Date</option>
                <option value="distance">Distance</option>
                <option value="duration">Duration</option>
          </select>
          <br />
          <input
              type="text"
              placeholder="Search workouts"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
          {searchPerformed && filteredWorkouts.length === 0 && (
            <p>No workouts found matching the search criteria.</p>
          )}
          {filteredWorkouts.length > 0 ? (
            <>
            <WorkoutList
              workouts={filteredWorkouts}
              onDeleteWorkout={handleDeleteWorkout}
              onEditWorkout={handleEditWorkout}
            />
            <TotalMetrics workouts={filteredWorkouts} />
            <button onClick={handleSavePlan}>Save Training Plan</button>
            <button onClick={handleLoadPlan}>Load Existing Training Plan</button>
          </>
          ) : (
            <div>
                <p>No workouts available. Please add a workout.</p>
                <button onClick={handleLoadPlan}>Load Existing Training Plan</button>
            </div>
          )}
        </>
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