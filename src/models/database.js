// encapsulates all IndexedDB-related operations
class CalculatorDB {
  constructor() {
    this.initializeDB()
  }

  initializeDB() {
    const request = window.indexedDB.open("calculatorDB", 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      db.createObjectStore("calculations", {
        keyPath: "id",
        autoIncrement: true,
      })
    }

    request.onsuccess = (event) => {
      this.db = event.target.result
    }

    request.onerror = (event) => {
      console.error("Error initializing IndexedDB:", event.target.errorCode)
    }
  }

  saveCalculation = (calculation) => {
    const transaction = this.db.transaction(["calculations"], "readwrite")
    const store = transaction.objectStore("calculations")
    store.add(calculation)
  }

  getCalculations = (callback) => {
    const transaction = this.db.transaction(["calculations"], "readonly")
    const store = transaction.objectStore("calculations")
    const request = store.getAll()

    request.onsuccess = (event) => {
      callback(event.target.result)
    }

    request.onerror = (event) => {
      console.error("Error retrieving calculations:", event.target.errorCode)
    }
  }
}

export default CalculatorDB