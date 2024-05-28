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

    saveToLocalStorage() {
        const planData = {
            workouts: this.trainingPlan.allMyWorkout,
        }
        localStorage.setItem('trainingPlan', JSON.stringify(planData))
    }

    loadFromLocalStorage() {
        const savedPlan = localStorage.getItem('trainingPlan')
        return savedPlan ? JSON.parse(savedPlan) : null
    }

    // IndexedDB methods
    async saveToIndexedDB() {
        return new Promise((resolve, reject) => {
            const dbName = 'TrainingPlanDB'
            const storeName = 'trainingPlans'

            const deleteRequest = indexedDB.deleteDatabase(dbName)
            deleteRequest.onsuccess = () => {
                console.log('Database deleted successfully')
                const request = indexedDB.open(dbName, 1)

                request.onerror = (event) => {
                    console.error(
                        'Error opening IndexedDB database:',
                        event.target.error
                    )
                    reject(event.target.error)
                }

                request.onsuccess = (event) => {
                    const db = event.target.result
                    const transaction = db.transaction(storeName, 'readwrite')
                    const objectStore = transaction.objectStore(storeName)
                    const planData = {
                        id: 'plan',
                        workouts: this.trainingPlan.allMyWorkout,
                    }

                    const addRequest = objectStore.put(planData)

                    addRequest.onsuccess = () => {
                        console.log(
                            'Training plan saved successfully to IndexedDB'
                        )
                        resolve()
                    }

                    addRequest.onerror = (event) => {
                        console.error(
                            'Error saving training plan to IndexedDB:',
                            event.target.error
                        )
                        reject(event.target.error)
                    }
                }

                request.onupgradeneeded = (event) => {
                    console.log('onupgradeneeded event triggered')
                    const db = event.target.result
                    db.createObjectStore(storeName, { keyPath: 'id' })
                }

                deleteRequest.onerror = (event) => {
                    console.error(
                        'Error deleting database:',
                        event.target.error
                    )
                    reject(event.target.error)
                }
            }
        })
    }

    async loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const dbName = 'TrainingPlanDB'
            const storeName = 'trainingPlans'
            const request = indexedDB.open(dbName, 1)

            request.onerror = (event) => {
                console.error(
                    'Error opening IndexedDB database:',
                    event.target.error
                )
                reject(event.target.error)
            }

            request.onsuccess = (event) => {
                const db = event.target.result
                const transaction = db.transaction(storeName, 'readonly')
                const objectStore = transaction.objectStore(storeName)

                const getRequest = objectStore.get('plan')

                getRequest.onsuccess = (event) => {
                    const plan = event.target.result
                    resolve(plan)
                }

                getRequest.onerror = (event) => {
                    console.error(
                        'Error loading training plan from IndexedDB:',
                        event.target.error
                    )
                    reject(event.target.error)
                }
            }
        })
    }
}
