import TrainingPlan from '../models/trainingplan'
import Workout from '../models/workout'

export default class TrainingPlanViewModel {
    constructor() {
        this.trainingPlan = null
    }

    createTrainingPlan() {
        this.trainingPlan = new TrainingPlan()
        this.trainingPlan.createPlan()
    }

    getTrainingPlan() {
        return this.trainingPlan
    }

    addWorkout(workoutType, workoutDistance, workoutDuration, workoutDate) {
        if (!this.trainingPlan) {
            throw new Error('Training plan not created')
        }

        const workout = new Workout(
            workoutType,
            parseFloat(workoutDistance),
            parseInt(workoutDuration),
            new Date(workoutDate)
        )

        this.trainingPlan.addWorkout(workout)
    }

    deleteWorkout(workout) {
        if (!this.trainingPlan) {
            throw new Error('Training plan not created')
        }

        const index = this.trainingPlan.allMyWorkout.findIndex(
            (w) => w === workout
        )
        if (index !== -1) {
            this.trainingPlan.allMyWorkout.splice(index, 1)
        }
    }

    updateWorkout(index, updatedWorkout) {
        if (!this.trainingPlan) {
            throw new Error('Training plan not created')
        }

        this.trainingPlan.updateWorkout(index, updatedWorkout)
    }
}
