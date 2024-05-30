import React, { useState } from 'react'
import PropTypes from 'prop-types'

function DatabaseConfig({ onSubmit, onLoadPlan }) {
    const [databaseType, setDatabaseType] = useState('indexedDB')
    const [databaseName, setDatabaseName] = useState('TrainingPlanDB')
    const [loadDatabaseName, setLoadDatabaseName] = useState('TrainingPlanDB')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ databaseType, databaseName })
        alert(
            `You have selected the database "${databaseName}" as save location.`
        )
    }

    const handleLoadPlan = () => {
        onLoadPlan(loadDatabaseName)
        alert(`You have loaded ${loadDatabaseName} from the database.`)
    }

    return (
        <div className='db-form'>
            <form onSubmit={handleSubmit}>
                <div className='input-field'>
                    <label>Database Type:</label>
                    <select
                        value={databaseType}
                        onChange={(e) => setDatabaseType(e.target.value)}
                    >
                        <option value='indexedDB'>IndexedDB</option>
                    </select>
                </div>
                <div className='input-field'>
                    <label>Database Name:</label>
                    <input
                        type='text'
                        value={databaseName}
                        onChange={(e) => setDatabaseName(e.target.value)}
                    />
                </div>
                <button className='db-config-button' type='submit'>
                    Set Database
                </button>
            </form>
            <div className='input-field'>
                <label>Load from DB:</label>
                <input
                    type='text'
                    value={loadDatabaseName}
                    onChange={(e) => setLoadDatabaseName(e.target.value)}
                />
            </div>
            <button className='db-config-button' onClick={handleLoadPlan}>
                Load Plan
            </button>
        </div>
    )
}

DatabaseConfig.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onLoadPlan: PropTypes.func.isRequired,
}

export default DatabaseConfig
