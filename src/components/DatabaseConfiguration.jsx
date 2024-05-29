import React, { useState } from 'react'
import PropTypes from 'prop-types'

function DatabaseConfig({ onSubmit, onLoadPlan }) {
    const [databaseType, setDatabaseType] = useState('indexedDB')
    const [databaseName, setDatabaseName] = useState('TrainingPlanDB')
    const [loadDatabaseName, setLoadDatabaseName] = useState('TrainingPlanDB')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ databaseType, databaseName })
        alert(`Database Name Saved: ${databaseName}`)
    }

    const handleLoadPlan = () => {
        onLoadPlan(loadDatabaseName)
    }

    return (
        <div className='database-config'>
            <form onSubmit={handleSubmit}>
                <label>
                    Database Type:
                    <select
                        value={databaseType}
                        onChange={(e) => setDatabaseType(e.target.value)}
                    >
                        <option value='indexedDB'>IndexedDB</option>
                        <option value='sqlite'>SQLite</option>
                        <option value='mysql'>MySQL</option>
                    </select>
                </label>
                <label>
                    Database Name:
                    <input
                        type='text'
                        value={databaseName}
                        onChange={(e) => setDatabaseName(e.target.value)}
                    />
                </label>
                <button type='submit'>Set Database</button>
            </form>
            <div className='edit-input-field'>
                <label>
                    Load from Database:
                    <input
                        type='text'
                        value={loadDatabaseName}
                        onChange={(e) => setLoadDatabaseName(e.target.value)}
                    />
                </label>
                <button onClick={handleLoadPlan}>Load Plan</button>
            </div>
        </div>
    )
}

DatabaseConfig.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onLoadPlan: PropTypes.func.isRequired,
}

export default DatabaseConfig
