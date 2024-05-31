import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import DatabaseConfig from '../components/DatabaseConfiguration'
import WorkoutForm from '../components/WorkoutForm'
import WorkoutList from '../components/WorkoutList'
import WorkoutEditForm from '../components/WorkoutEditForm'
import SortSearch from '../components/SortSearch'
import TotalMetrics from '../components/TotalMetrics'

function TrainingPlanPage({ viewModel }) {
    const [workoutType, setWorkoutType] = useState('run')
    const [workoutDistance, setWorkoutDistance] = useState('5')
    const [workoutDuration, setWorkoutDuration] = useState('30')
    const [workoutDate, setWorkoutDate] = useState(
        new Date().toISOString().slice(0, 10)
    )
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

    const handleDatabaseConfig = (config) => {
        viewModel.saveDatabaseConfig(config)
    }

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
        if (!workoutDistance) {
            setError('Please fill in workout distance')
            return
        }
        if (!workoutDuration) {
            setError('Please fill in workout duration')
            return
        }
        if (!workoutDate) {
            setError('Please select a date for the workout')
            return
        }
        try {
            viewModel.addWorkout(
                workoutType,
                workoutDistance,
                workoutDuration,
                workoutDate
            )
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
            viewModel.deleteWorkout(workoutToDelete)
            const updatedWorkouts = trainingPlan.allMyWorkout.filter(
                (workout) => workout !== workoutToDelete
            )
            setTrainingPlan({ ...trainingPlan, allMyWorkout: updatedWorkouts })
            alert('Workout deleted successfully!')
        } catch (err) {
            setError('An error occurred while deleting the workout')
            alert('Failed to delete the workout. Please try again.')
        }
    }

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

    const handleUpdateWorkout = (
        workoutType,
        workoutDistance,
        workoutDuration,
        workoutDate
    ) => {
        try {
            viewModel.updateWorkout(
                editedWorkoutIndex,
                workoutType,
                workoutDistance,
                workoutDuration,
                workoutDate
            )
            setTrainingPlan(viewModel.getTrainingPlan())
            setEditedWorkout(null)
            setEditedWorkoutIndex(null)
            setOriginalWorkout(null)
        } catch (err) {
            setError('An error occurred while updating the workout')
        }
    }

    const handleCancelEdit = () => {
        setEditedWorkout(null)
        setEditedWorkoutIndex(null)
        setOriginalWorkout(null)
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

    const handleSavePlan = async () => {
        viewModel.saveToLocalStorage()
        await viewModel.saveToIndexedDB()
        console.log('Training plan saved to localStorage and IndexedDB')
    }

    const handleLoadPlan = async (databaseName) => {
        try {
            const loadedPlan = await viewModel.loadPlan(databaseName)
            if (loadedPlan) {
                setTrainingPlan(loadedPlan)
                console.log('Training plan loaded')
            } else {
                console.log('No saved training plan found')
                alert('No existing plans can be loaded.')
            }
        } catch (error) {
            console.error('Error loading training plan:', error)
            alert(
                'Failed to load training plan. Please check the database name.'
            )
        }
    }

    const handleSaveToFile = async () => {
        try {
            await viewModel.saveToFile()
            alert('Training plan saved to file')
        } catch (error) {
            console.error('Error saving training plan to file:', error)
            alert('Failed to save training plan to file')
        }
    }

    const handleLoadFromFile = async () => {
        try {
            const loadedPlan = await viewModel.loadFromFile()
            if (loadedPlan) {
                setTrainingPlan(loadedPlan)
                alert('Training plan loaded from file')
            } else {
                alert('No training plan found in the file')
            }
        } catch (error) {
            console.error('Error loading training plan from file:', error)
            alert('Failed to load training plan from file')
        }
    }

    return (
        <>
            {trainingPlan ? (
                <>
                    <h2>Training Plan</h2>
                    <DatabaseConfig
                        onSubmit={handleDatabaseConfig}
                        onLoadPlan={handleLoadPlan}
                    />
                    <button
                        className='btn-file-api'
                        onClick={handleLoadFromFile}
                    >
                        Load from File
                    </button>
                    <div className='workout-form'>
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
                    </div>
                    <TotalMetrics workouts={filteredWorkouts} />
                    <SortSearch
                        sortCriteria={sortCriteria}
                        onSortChange={handleSortChange}
                        searchQuery={searchQuery}
                        onSearchInputChange={handleSearchInputChange}
                        onSearch={handleSearch}
                    />
                    {searchPerformed && filteredWorkouts.length === 0 && (
                        <p>No workouts matching the search criteria.</p>
                    )}
                    {filteredWorkouts.length > 0 ? (
                        <>
                            <WorkoutList
                                workouts={filteredWorkouts}
                                onDeleteWorkout={handleDeleteWorkout}
                                onEditWorkout={handleEditWorkout}
                            />
                            <button onClick={handleSavePlan}>Save Plan</button>
                            <button
                                className='btn-file-api'
                                onClick={handleSaveToFile}
                            >
                                Save to File
                            </button>
                        </>
                    ) : (
                        <div>
                            <p>No workouts available. Please add a workout.</p>
                        </div>
                    )}
                </>
            ) : (
                <button onClick={handleCreatePlan}>Create Plan</button>
            )}
        </>
    )
}

TrainingPlanPage.propTypes = {
    viewModel: PropTypes.object.isRequired,
}

export default TrainingPlanPage
