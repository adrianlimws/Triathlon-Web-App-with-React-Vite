// Model: Represents the business logic for adding numbers.
class CalculatorModel {
  constructor(db) {
    this.db = db
    this.clear()
  }

  add(x) {
    this.result += x
  }

  clear() {
    this.result = 0
  }

  getResult() {
    return this.result
  }

  saveCalculation = (min, max, step, result) => {
    this.db.saveCalculation({ min, max, step, result })
  }

  getCalculations = (callback) => {
    this.db.getCalculations(callback)
  }
}

export default CalculatorModel
