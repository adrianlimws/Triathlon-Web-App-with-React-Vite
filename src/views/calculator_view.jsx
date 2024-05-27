import { useState } from "react"
import PropTypes from "prop-types"

// https://legacy.reactjs.org/docs/typechecking-with-proptypes.html
CalculatorView.propTypes = {
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
}

// View is responsible for rendering the UI and handling user interactions.
function CalculatorView({ onSubmit, onClear }) {
  const [result, setResult] = useState(undefined)

  const handleSubmit = (e) => {
    /*
      https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
      The preventDefault() method of the Event interface tells the user 
      agent that if the event does not get explicitly handled, its default 
      action should not be taken as it normally would be.
      */
    e.preventDefault()
    const min = parseInt(e.target.min.value) || ""
    const max = parseInt(e.target.max.value) || ""
    const step = parseInt(e.target.step.value) || ""

    setResult(onSubmit(min, max, step))
    onClear()
  }

  const handleClear = () => {
    clearInputs()
    onClear()
    setResult(undefined)
  }

  const clearInputs = () => {
    document.getElementById("min").value = ""
    document.getElementById("max").value = ""
    document.getElementById("step").value = ""
  }

  return (
    <div>
      <h1>Input</h1>
      <form onSubmit={handleSubmit}>
        <label>Min: </label>
        <input type="number" id="min" />
        <br />
        <br />
        <label>Max: </label>
        <input type="number" id="max" />
        <br />
        <br />
        <label>Step: </label>
        <input type="number" id="step" />
        <br />
        <br />
        <button type="submit">Sum</button>
      </form>
      <br />
      <button onClick={handleClear}>Clear</button>
      <div hidden={result === undefined}>
        <h1>Result</h1>
        <p>{result}</p>
      </div>
    </div>
  )
}

export default CalculatorView
