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
                    duration: this.duration / 60, // Convert to hours
                    pace: this.duration / this.distance, // minutes per kilometer
                }
            case 'swim':
                return {
                    distance: this.distance,
                    duration: this.duration / 60, // Convert to hours
                    pace: this.duration / this.distance, // minutes per kilometer
                }
            case 'bike':
                return {
                    distance: this.distance,
                    duration: this.duration / 60, // Convert to hours
                    speed: this.distance / (this.duration / 60), // kilometers per hour
                }
            default:
                throw new Error('Invalid workout type')
        }
    }
}
