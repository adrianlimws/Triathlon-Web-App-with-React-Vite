export default class GoalManager {
    constructor() {
        this.allMyGoal = []
    }

    setGoal(goal) {
        if (!this.validateGoal(goal)) {
            if (
                !Object.prototype.hasOwnProperty.call(goal, 'type') ||
                !['distance', 'duration'].includes(goal.type)
            ) {
                throw new Error('Invalid goal type')
            } else if (
                !Object.prototype.hasOwnProperty.call(goal, 'target') ||
                typeof goal.target !== 'number' ||
                goal.target <= 0
            ) {
                throw new Error('Invalid goal target')
            } else {
                throw new Error('Invalid goal')
            }
        }
        this.allMyGoal.push(goal)
    }

    validateGoal(goal) {
        const validTypes = ['distance', 'duration']
        return (
            typeof goal === 'object' &&
            Object.prototype.hasOwnProperty.call(goal, 'type') &&
            validTypes.includes(goal.type) &&
            Object.prototype.hasOwnProperty.call(goal, 'target') &&
            typeof goal.target === 'number' &&
            goal.target > 0
        )
    }

    trackGoals(workouts) {
        const planMetrics = this.calculatePlanMetrics(workouts)

        this.allMyGoal.forEach((goal) => {
            const { totalDistance, totalDuration } = planMetrics

            if (goal.type === 'distance') {
                goal.achieved = totalDistance >= goal.target
            } else if (goal.type === 'duration') {
                goal.achieved = totalDuration <= goal.target
            } else {
                goal.achieved = false
            }
        })
    }

    calculatePlanMetrics(workouts) {
        let totalDistance = 0
        let totalDuration = 0
        workouts.forEach((workout) => {
            const metrics = workout.calculateMetrics()
            totalDistance += metrics.distance
            totalDuration += metrics.duration
        })
        return { totalDistance, totalDuration }
    }
}
