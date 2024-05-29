import TrainingPlan from '../models/trainingplan'
import Workout from '../models/workout'

export default class TrainingPlanViewModel {
    constructor() {
        this.trainingPlan = null
        this.databaseConfig = {
            databaseType: 'indexedDB',
            databaseName: 'TrainingPlanDB',
        }
    }

    saveDatabaseConfig(config) {
        this.databaseConfig = config
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

        if (
            !workoutType ||
            !workoutDistance ||
            !workoutDuration ||
            !workoutDate
        ) {
            throw new Error('Invalid workout data')
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
            this.trainingPlan.deleteWorkout(index)
        }
    }

    updateWorkout(
        index,
        workoutType,
        workoutDistance,
        workoutDuration,
        workoutDate
    ) {
        if (!this.trainingPlan) {
            throw new Error('Training plan not created')
        }

        const updatedWorkout = new Workout(
            workoutType,
            parseFloat(workoutDistance),
            parseInt(workoutDuration),
            new Date(workoutDate)
        )

        this.trainingPlan.updateWorkout(index, updatedWorkout)
    }

    saveToLocalStorage() {
        const planData = {
            workouts: this.trainingPlan.allMyWorkout,
        }
        window.localStorage.setItem('trainingPlan', JSON.stringify(planData))
    }

    loadFromLocalStorage() {
        const savedPlan = window.localStorage.getItem('trainingPlan')
        return savedPlan ? JSON.parse(savedPlan) : null
    }

    async loadPlan() {
        try {
            const loadedPlanFromIndexedDB = await this.loadFromIndexedDB()
            if (loadedPlanFromIndexedDB) {
                this.trainingPlan = new TrainingPlan()
                this.trainingPlan.allMyWorkout =
                    loadedPlanFromIndexedDB.workouts.map(
                        (workout) =>
                            new Workout(
                                workout.type,
                                workout.distance,
                                workout.duration,
                                new Date(workout.date)
                            )
                    )
                this.saveToLocalStorage()
                return this.trainingPlan
            } else {
                const loadedPlanFromLocalStorage = this.loadFromLocalStorage()
                if (loadedPlanFromLocalStorage) {
                    this.trainingPlan = new TrainingPlan()
                    this.trainingPlan.allMyWorkout =
                        loadedPlanFromLocalStorage.workouts.map(
                            (workout) =>
                                new Workout(
                                    workout.type,
                                    workout.distance,
                                    workout.duration,
                                    new Date(workout.date)
                                )
                        )
                    return this.trainingPlan
                } else {
                    return null
                }
            }
        } catch (error) {
            console.error('Error loading training plan:', error)
            return null
        }
    }

    // IndexedDB methods
    async saveToIndexedDB() {
        return new Promise((resolve, reject) => {
            const { databaseType, databaseName } = this.databaseConfig
            const storeName = 'trainingPlans'

            if (databaseType === 'indexedDB') {
                const deleteRequest = indexedDB.deleteDatabase(databaseName)
                deleteRequest.onsuccess = () => {
                    console.log('Database deleted successfully')
                    const request = indexedDB.open(databaseName, 1)

                    request.onerror = (event) => {
                        console.error(
                            'Error opening IndexedDB database:',
                            event.target.error
                        )
                        reject(new Error('Failed to open IndexedDB database'))
                    }

                    request.onsuccess = (event) => {
                        const db = event.target.result
                        const transaction = db.transaction(
                            storeName,
                            'readwrite'
                        )
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
                            reject(
                                new Error(
                                    'Failed to save training plan to IndexedDB'
                                )
                            )
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
                        reject(new Error('Failed to delete IndexedDB database'))
                    }
                }
            } else {
                reject(new Error('Unsupported database type'))
            }
        })
    }

    async loadFromIndexedDB() {
        return new Promise((resolve, reject) => {
            const { databaseType, databaseName } = this.databaseConfig
            const storeName = 'trainingPlans'

            if (databaseType === 'indexedDB') {
                const request = indexedDB.open(databaseName, 1)

                request.onerror = (event) => {
                    console.error(
                        'Error opening IndexedDB database:',
                        event.target.error
                    )
                    reject(new Error('Failed to open IndexedDB database'))
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
                        reject(
                            new Error(
                                'Failed to load training plan from IndexedDB'
                            )
                        )
                    }
                }
            } else {
                reject(new Error('Unsupported database type'))
            }
        })
    }
}
