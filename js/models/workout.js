import Goal from './goal.js'

export default class Workout {
    constructor(type, distance, duration, date, goal, reminder = null) {
        this.type = type
        this.distance = distance
        this.duration = duration
        this.date = date
        this.goal = goal
        this.reminder = reminder
    }

    calculateMetrics() {
        switch (this.type) {
            case 'run':
                return {
                    distance: this.distance,
                    duration: this.duration / 60, // Convert to minutes
                    pace: this.duration / 60 / (this.distance / 1000), // minutes per kilometer
                }
            case 'swim':
                return {
                    distance: this.distance,
                    duration: this.duration, // Duration is in minutes
                    pace: this.duration / (this.distance / 1000), // minutes per meter
                }
            case 'bike':
                return {
                    distance: this.distance,
                    duration: this.duration / 60, // Convert to minutes
                    speed: this.distance / 1000 / (this.duration / 3600), // kilometers per hour
                }
            default:
                throw new Error('Invalid workout type')
        }
    }

    hasGoal() {
        return this.goal !== undefined
    }

    goalAchieved() {
        if (!this.hasGoal()) {
            return false
        }

        const metrics = this.calculateMetrics()
        if (this.goal.type === 'distance') {
            return metrics.distance >= this.goal.target
        } else if (this.goal.type === 'duration') {
            return metrics.duration <= this.goal.target
        }
        return false
    }
}
