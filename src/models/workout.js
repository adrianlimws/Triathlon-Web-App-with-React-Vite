export default class Workout {
    constructor(type, distance, duration, date) {
        this.type = type
        this.distance = distance
        this.duration = duration
        this.date = date
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
}
