import React, { useState } from 'react'
import PropTypes from 'prop-types'

function DatabaseConfig({ onSubmit }) {
    const [databaseType, setDatabaseType] = useState('indexedDB')
    const [databaseName, setDatabaseName] = useState('TrainingPlanDB')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit({ databaseType, databaseName })
    }

    return (
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
            <button type='submit'>Save Configuration</button>
        </form>
    )
}

DatabaseConfig.propTypes = {
    onSubmit: PropTypes.func.isRequired,
}

export default DatabaseConfig
