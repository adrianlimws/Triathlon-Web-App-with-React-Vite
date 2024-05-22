const TrainingPlanView = ({
    trainingPlan,
    onAddWorkout,
    onAddGoal,
    onSavePlan,
    onLoadPlan,
}) => {
    return (
        <div>
            <h2>Training Plan</h2>
            {/* Render training plan details */}
            <button onClick={onAddWorkout}>Add Workout</button>
            <button onClick={onAddGoal}>Add Goal</button>
            <button onClick={onSavePlan}>Save Plan</button>
            <button onClick={onLoadPlan}>Load Plan</button>
        </div>
    )
}
