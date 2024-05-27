/*
ViewModel: Acts as an intermediary between the View and the Model. It manages 
the state and operations related to the calculator.
*/
class CalculatorViewModel {
  constructor(model) {
    this.model = model
    this.state = {
      min: "",
      max: "",
      step: "",
      result: undefined,
    }

    this.calculate = this.calculate.bind(this)
  }

  calculate(min, max, step) {
    this.setState({min: min, max: max, step: step})

    if (
      this.state.min !== "" &&
      this.state.max !== "" &&
      this.state.step !== ""
    ) {
      for (
        let value = this.state.min;
        value <= this.state.max;
        value += this.state.step
      ) {
        this.model.add(value)
      }
      this.state.result = this.model.getResult()
      this.model.saveCalculation(min, max, step, this.state.result);
    } else {
      this.state.result = undefined
    }

    return this.state.result
  }

  clear = () => {
    this.model.clear()
    this.setState({
      min: "",
      max: "",
      step: "",
      result: undefined,
    })
  }

  setState(newState) {
    this.state = { ...this.state, ...newState }
  }
}

export default CalculatorViewModel