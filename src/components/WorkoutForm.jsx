import React from 'react'
import PropTypes from 'prop-types'
import InputField from './InputField'

function WorkoutForm({
    onSubmit,
    error,
    workoutType,
    setWorkoutType,
    workoutDistance,
    setWorkoutDistance,
    workoutDuration,
    setWorkoutDuration,
    workoutDate,
    setWorkoutDate,
}) {
    return (
        <form onSubmit={onSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <label>Workout: </label>
            <select
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
            >
                <option value='run'>Running</option>
                <option value='swim'>Swimming</option>
                <option value='bike'>Biking</option>
            </select>
            <InputField
                label='Distance (km): '
                type='number'
                value={workoutDistance}
                onChange={(e) => setWorkoutDistance(e.target.value)}
            />
            <InputField
                label='Duration (minutes): '
                type='number'
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
            />
            <InputField
                label='Date: '
                type='date'
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
            />
            <button type='submit'>Add Workout</button>
        </form>
    )
}

WorkoutForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    error: PropTypes.string,
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
