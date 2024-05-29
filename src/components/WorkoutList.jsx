import React from 'react'
import PropTypes from 'prop-types'

function WorkoutList({ workouts, onDeleteWorkout, onEditWorkout }) {
    return (
        <ul className='workout-list'>
            {workouts.map((workout, index) => (
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
                        <strong>Date:</strong>{' '}
                        {workout.date.toLocaleDateString()}
                    </div>
                    {(() => {
                        const metrics = workout.calculateMetrics()
                        return (
                            <>
                                <div>
                                    <strong>
                                        {workout.type === 'bike'
                                            ? 'Speed'
                                            : 'Pace'}
                                        :
                                    </strong>{' '}
                                    {workout.type === 'bike'
                                        ? `${metrics.speed.toFixed(2)} km/h`
                                        : `${metrics.pace.toFixed(2)} min/km`}
                                </div>
                            </>
                        )
                    })()}
                    <button
                        className='btn-delete'
                        onClick={() => onDeleteWorkout(workout)}
                    >
                        Delete
                    </button>
                    <button
                        className='btn-edit'
                        onClick={() => onEditWorkout(workout, index)}
                    >
                        Edit
                    </button>
                </li>
            ))}
        </ul>
    )
}

WorkoutList.propTypes = {
    workouts: PropTypes.array.isRequired,
    onDeleteWorkout: PropTypes.func.isRequired,
    onEditWorkout: PropTypes.func.isRequired,
}

export default WorkoutList
