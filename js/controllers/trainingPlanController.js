class TrainingPlanController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            trainingPlan: new TrainingPlan(),
        }
    }

    handleAddWorkout = () => {
        // Logic for adding a workout
    }

    handleAddGoal = () => {
        // Logic for adding a goal
    }

    handleSavePlan = () => {
        // Logic for saving the plan
    }

    handleLoadPlan = () => {
        // Logic for loading the plan
    }

    render() {
        const { trainingPlan } = this.state

        return (
            <TrainingPlanView
                trainingPlan={trainingPlan}
                onAddWorkout={this.handleAddWorkout}
                onAddGoal={this.handleAddGoal}
                onSavePlan={this.handleSavePlan}
                onLoadPlan={this.handleLoadPlan}
            />
        )
    }
}
