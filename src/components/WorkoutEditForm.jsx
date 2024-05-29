import React, { useState, useEffect } from 'react'
import InputField from './InputField'
import PropTypes from 'prop-types'

function WorkoutEditForm({ workout, onSubmit, onCancel, onRevertChanges }) {
    const [initialWorkoutType, setInitialWorkoutType] = useState(workout.type)
    const [initialWorkoutDistance, setInitialWorkoutDistance] = useState(
        workout.distance
    )
    const [initialWorkoutDuration, setInitialWorkoutDuration] = useState(
        workout.duration
    )
    const [initialWorkoutDate, setInitialWorkoutDate] = useState(
        workout.date.toISOString().slice(0, 10)
    )

    const [workoutType, setWorkoutType] = useState(workout.type)
    const [workoutDistance, setWorkoutDistance] = useState(workout.distance)
    const [workoutDuration, setWorkoutDuration] = useState(workout.duration)
    const [workoutDate, setWorkoutDate] = useState(
        workout.date.toISOString().slice(0, 10)
    )

    useEffect(() => {
        setInitialWorkoutType(workout.type)
        setInitialWorkoutDistance(workout.distance)
        setInitialWorkoutDuration(workout.duration)
        setInitialWorkoutDate(workout.date.toISOString().slice(0, 10))
    }, [workout])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(workoutType, workoutDistance, workoutDuration, workoutDate)
    }

    const handleRevertChanges = () => {
        setWorkoutType(initialWorkoutType)
        setWorkoutDistance(initialWorkoutDistance)
        setWorkoutDuration(initialWorkoutDuration)
        setWorkoutDate(initialWorkoutDate)
        onRevertChanges()
    }

    return (
        <form className='workout-edit' onSubmit={handleSubmit}>
            <div className='input-field'>
                <label>Workout Type: </label>
                <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                >
                    <option value=''>Select Workout Type</option>
                    <option value='run'>Running</option>
                    <option value='swim'>Swimming</option>
                    <option value='bike'>Biking</option>
                </select>
            </div>
            <InputField
                label='Distance (km): '
                type='number'
                min={1}
                value={workoutDistance.toString()}
                onChange={(e) => setWorkoutDistance(e.target.value)}
                step={0.1}
            />
            <InputField
                label='Duration (mins): '
                type='number'
                min={1}
                value={workoutDuration.toString()}
                onChange={(e) => setWorkoutDuration(e.target.value)}
            />
            <InputField
                label='Date: '
                type='date'
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
            />
            <div className='edit-input-field'>
                <button type='button' onClick={handleRevertChanges}>
                    Revert Changes
                </button>
                <button type='submit'>Update Workout</button>
                <button type='button' onClick={onCancel}>
                    Cancel
                </button>
            </div>
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
