import './App.css'
import TrainingPlanPage from './views/TrainingPlanPage'
import TrainingPlanViewModel from './viewmodel/TrainingPlanViewModel'

function App() {
    const viewModel = new TrainingPlanViewModel()

    return (
        <div className='main'>
            <h1>Training Plan App</h1>
            <TrainingPlanPage viewModel={viewModel} />
        </div>
    )
}

export default App
