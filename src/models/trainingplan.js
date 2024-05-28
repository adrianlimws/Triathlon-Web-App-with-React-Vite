import Workout from './workout.js'

export default class TrainingPlan {
    constructor() {
        this.allMyWorkout = []
    }

    createPlan() {
        this.allMyWorkout = []
    }

    addWorkout(workout) {
        if (!this.validateWorkout(workout)) {
            throw new Error('Invalid workout object')
        }
        this.allMyWorkout.push(workout)
    }

    sortWorkouts(criteria) {
        const validCriteria = ['date', 'distance', 'duration']
        if (!criteria || !validCriteria.includes(criteria)) {
            return
        }

        switch (criteria) {
            case 'date':
                this.sortByDate()
                break
            case 'distance':
                this.sortByDistance()
                break
            case 'duration':
                this.sortByDuration()
                break
        }
    }

    sortByDate() {
        this.allMyWorkout.sort((a, b) => a.date - b.date)
    }

    sortByDistance() {
        this.allMyWorkout.sort((a, b) => a.distance - b.distance)
    }

    sortByDuration() {
        this.allMyWorkout.sort((a, b) => a.duration - b.duration)
    }

    searchWorkouts(criteria, value) {
        return this.allMyWorkout.filter(
            (workout) => workout[criteria] === value
        )
    }

    deleteWorkout(index) {
        if (!this.validateIndex(index)) {
            throw new Error('Invalid workout index')
        }
        this.allMyWorkout.splice(index, 1)
    }

    updateWorkout(index, updatedWorkout) {
        if (!this.validateIndex(index)) {
            throw new Error('Invalid workout index')
        }
        this.allMyWorkout[index] = updatedWorkout
    }

    revertWorkout(index, originalWorkout) {
        if (!this.validateIndex(index)) {
            throw new Error('Invalid workout index')
        }
        this.allMyWorkout[index] = originalWorkout
    }

    validateInput(input, type) {
        switch (type) {
            case 'duration':
                return typeof input === 'number' && input > 0
            case 'distance':
                return typeof input === 'number' && input > 0
            case 'date':
                return input instanceof Date
            default:
                return false
        }
    }

    // good to check an Obj => object, property & instance value not just data types (extra safety)
    validateWorkout(workout) {
        return (
            typeof workout === 'object' &&
            Object.prototype.hasOwnProperty.call(workout, 'type') &&
            Object.prototype.hasOwnProperty.call(workout, 'distance') &&
            Object.prototype.hasOwnProperty.call(workout, 'duration') &&
            Object.prototype.hasOwnProperty.call(workout, 'date') &&
            typeof workout.type === 'string' &&
            typeof workout.distance === 'number' &&
            typeof workout.duration === 'number' &&
            workout.date instanceof Date
        )
    }

    validateIndex(index) {
        return (
            Number.isInteger(index) &&
            index >= 0 &&
            index < this.allMyWorkout.length
        )
    }

    calculatePlanMetrics() {
        let totalDistance = 0
        let totalDuration = 0
        this.allMyWorkout.forEach((workout) => {
            const metrics = workout.calculateMetrics()
            totalDistance += metrics.distance
            totalDuration += metrics.duration
        })
        return { totalDistance, totalDuration }
    }

    async savePlan() {
        try {
            this.saveToLocalStorage()
            console.log('Training plan saved successfully to localStorage')

            await this.saveToIndexedDB()
            console.log('Training plan saved successfully to IndexedDB')
        } catch (error) {
            console.error('Error saving training plan:', error)
        }
    }
    // Save plan helpers
    saveToLocalStorage() {
        const planData = {
            workouts: this.allMyWorkout,
        }
        console.log('saveToLocalStorage data', planData)
        //  works in node env, but if targeting browser use window.localStorage (demo in index.html)
        localStorage.setItem('trainingPlan', JSON.stringify(planData))
    }

    getPlanData() {
        return {
            workouts: this.allMyWorkout,
        }
    }

    async runInsertQuery(db, planData) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO training_plans (data) VALUES (?)',
                [JSON.stringify(planData)],
                (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
    }

    async createTableIfNotExists(db) {
        db.run(
            'CREATE TABLE IF NOT EXISTS training_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)'
        )
    }

    async insertPlanIntoDatabase(db) {
        const planData = this.getPlanData()
        try {
            const stmt = db.prepare(
                'INSERT INTO training_plans (data) VALUES (?)'
            )
            stmt.run(JSON.stringify(planData))
            stmt.free()
        } catch (error) {
            throw new Error('Error inserting plan into the database')
        }
    }

    async loadPlan() {
        try {
            const savedPlanFromLocalStorage = this.loadFromLocalStorage()
            console.log(
                'Loaded plan from localStorage:',
                savedPlanFromLocalStorage
            )

            const savedPlanFromIndexedDB = await this.loadFromIndexedDB()
            console.log('Loaded plan from IndexedDB:', savedPlanFromIndexedDB)

            const mergedPlan = this.mergePlans(
                savedPlanFromIndexedDB,
                savedPlanFromLocalStorage
            )

            if (mergedPlan) {
                this.allMyWorkout = this.parseWorkouts(
                    mergedPlan.workouts || []
                )
            } else {
                this.resetPlan()
            }
        } catch (error) {
            console.error('Error loading training plan:', error)
        }
    }

    // load plan helpers
    parseWorkouts(workouts) {
        return workouts.map((workout) => {
            return new Workout(
                workout.type,
                workout.distance,
                workout.duration,
                new Date(workout.date)
            )
        })
    }

    resetPlan() {
        this.allMyWorkout = []
    }

    loadFromLocalStorage() {
        const savedPlan = localStorage.getItem('trainingPlan')
        return savedPlan ? JSON.parse(savedPlan) : null
    }

    mergePlans(savedPlanFromDatabase, savedPlanFromLocalStorage) {
        if (savedPlanFromDatabase && savedPlanFromDatabase.length > 0) {
            return savedPlanFromDatabase[0]
        } else if (savedPlanFromLocalStorage) {
            return savedPlanFromLocalStorage
        } else {
            return null
        }
    }
}
