import './styles/App.css'
import TrainingPlanPage from './views/TrainingPlanPage'
import TrainingPlanViewModel from './viewmodel/TrainingPlanViewModel'

function App() {
    const viewModel = new TrainingPlanViewModel()

    return (
        <>
            <nav className='navbar'>
                <h1>Triathlon App</h1>
            </nav>
            <div className='main'>
                <TrainingPlanPage viewModel={viewModel} />
            </div>
        </>
    )
}

export default App
