import GoalManager from './goalManager.js'
import Workout from './workout.js'
import Goal from './goal.js'
// import sqlite3 from 'sqlite3'

/* uncomment if using with main.js console.log purposes */
// import { LocalStorage } from 'node-localstorage'
// const localStorage = new LocalStorage('./localstore')

export default class TrainingPlan {
    constructor() {
        this.allMyWorkout = []
        this.goalManager = new GoalManager()
        this.reminders = []
    }

    createPlan() {
        this.allMyWorkout = []
        this.goalManager.allMyGoal = []
    }

    addWorkout(workout) {
        if (!this.validateWorkout(workout)) {
            throw new Error('Invalid workout object')
        }
        this.allMyWorkout.push(workout)
        if (workout.reminder) {
            this.reminders.push(workout.reminder, workout)
        }
    }

    addGoal(goal) {
        this.goalManager.setGoal(goal)
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
            workout.date instanceof Date &&
            (!workout.reminder || workout.reminder instanceof Date)
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

    // reminder methods
    setReminder(reminderDateTime, workout) {
        if (!(reminderDateTime instanceof Date)) {
            throw new Error('Invalid reminder date and time')
        }
        const reminder = {
            workout: workout,
            reminderDateTime: reminderDateTime,
        }
        this.reminders.push(reminder)
        this.scheduleReminder(reminder)
    }

    scheduleReminder(reminder, scheduler = setTimeout) {
        const currentTime = new Date().getTime()
        const reminderTime = reminder.reminderDateTime.getTime()
        const delay = reminderTime - currentTime

        if (delay > 0) {
            scheduler(() => {
                this.displayReminder(reminder)
            }, delay)
        }
    }

    displayReminder(reminder) {
        const { workout } = reminder
        console.log(
            `Reminder: You have a pending ${
                workout.type
            } workout on ${workout.date.toLocaleDateString()}.`
        )
    }

    async savePlan() {
        try {
            this.saveToLocalStorage()
            console.log('Training plan saved successfully to localStorage')

            const db = await this.connectToDatabase()
            await this.createTableIfNotExists(db)
            await this.insertPlanIntoDatabase(db)
            db.close()
        } catch (error) {
            console.error('Error saving training plan:', error)
        }
    }

    // Save plan helpers
    saveToLocalStorage() {
        const planData = {
            workouts: this.allMyWorkout,
            goals: this.goalManager.allMyGoal,
        }
        console.log('saveToLocalStorage data', planData)
        //  works in node env, but if targeting browser use window.localStorage (demo in index.html)
        localStorage.setItem('trainingPlan', JSON.stringify(planData))
    }

    async insertPlanIntoDatabase(db) {
        const planData = this.getPlanData()
        try {
            await this.runInsertQuery(db, planData)
        } catch (error) {
            throw new Error('Error inserting plan into the database')
        }
    }

    getPlanData() {
        return {
            workouts: this.allMyWorkout,
            goals: this.goalManager.allMyGoal,
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
        await new Promise((resolve, reject) => {
            db.run(
                'CREATE TABLE IF NOT EXISTS training_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)',
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

    async loadPlan() {
        let savedPlanFromDatabase = []
        try {
            // load trainingplan from localStorage
            const savedPlanFromLocalStorage = this.loadFromLocalStorage()
            console.log(
                'savedPlanFromLocalStorage: ',
                savedPlanFromLocalStorage
            )

            try {
                // try to connect to sqlite db
                const db = await this.connectToDatabase()
                savedPlanFromDatabase = await this.loadFromDatabase(db)
                db.close()
            } catch (error) {
                console.error('Error connecting to the database:', error)
            }

            const mergedPlan = this.mergePlans(
                savedPlanFromDatabase,
                savedPlanFromLocalStorage
            )

            if (mergedPlan) {
                this.allMyWorkout = this.parseWorkouts(
                    mergedPlan.workouts || []
                )
                this.goalManager.allMyGoal = this.parseGoals(
                    mergedPlan.goals || []
                )
                this.reminders = this.extractReminders(this.allMyWorkout)
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
                new Date(workout.date),
                workout.goal,
                workout.reminder ? new Date(workout.reminder) : null
            )
        })
    }

    parseGoals(goals) {
        return goals.map((goal) => new Goal(goal.type, goal.target))
    }

    resetPlan() {
        this.allMyWorkout = []
        this.goalManager.allMyGoal = []
    }

    extractReminders(workouts) {
        return workouts
            .filter((workout) => workout.reminder)
            .map((workout) => workout.reminder)
    }

    loadFromLocalStorage() {
        // works in node env, but if targeting browser use window.localStorage (demo in index.html)
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

    // db loading and db connectivity
    async loadFromDatabase(db) {
        return new Promise((resolve, reject) => {
            db.all('SELECT data FROM training_plans', (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows.map((row) => JSON.parse(row.data)))
                }
            })
        })
    }

    async connectToDatabase() {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('trainingPlan.db', (err) => {
                if (err) {
                    console.error('Error opening database:', err)
                    reject(err)
                } else {
                    console.log('Connected to the SQLite database.')
                    resolve(db)
                }
            })
        })
    }
}
