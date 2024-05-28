import React from 'react'
import PropTypes from 'prop-types'

function TotalMetrics({ workouts }) {
    const calculateTotalMetrics = (workouts) => {
        let totalDistance = 0
        let totalDuration = 0

        workouts.forEach((workout) => {
            const metrics = workout.calculateMetrics()
            totalDistance += metrics.distance
            totalDuration += metrics.duration
        })

        return { totalDistance, totalDuration }
    }

    const { totalDistance, totalDuration } = calculateTotalMetrics(workouts)

    return (
        <div className='t-metrics'>
            <h3>Total Metrics</h3>
            <p>Total Distance: {totalDistance.toFixed(2)} km</p>
            <p>Total Duration: {totalDuration.toFixed(2)} hours</p>
        </div>
    )
}

TotalMetrics.propTypes = {
    workouts: PropTypes.arrayOf(
        PropTypes.shape({
            calculateMetrics: PropTypes.func.isRequired,
        })
    ).isRequired,
}

export default TotalMetrics
