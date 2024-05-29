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
        <div className='db-config'>
            <div className='db-config-container'>
                <form className='db-config-form' onSubmit={handleSubmit}>
                    <label className='db-config-label'>
                        Database Type:
                        <select
                            className='db-config-input'
                            value={databaseType}
                            onChange={(e) => setDatabaseType(e.target.value)}
                        >
                            <option value='indexedDB'>IndexedDB</option>
                        </select>
                    </label>
                    <div className='db-input-field'>
                        <label className='db-config-label'>
                            Database Name:
                            <input
                                className='db-config-input'
                                type='text'
                                value={databaseName}
                                onChange={(e) =>
                                    setDatabaseName(e.target.value)
                                }
                            />
                        </label>
                        <button className='db-config-button' type='submit'>
                            Set Database
                        </button>
                    </div>
                </form>
                <div className='db-input-field'>
                    <label className='db-config-label'>
                        Load from Database:
                        <input
                            className='db-config-input'
                            type='text'
                            value={loadDatabaseName}
                            onChange={(e) =>
                                setLoadDatabaseName(e.target.value)
                            }
                        />
                    </label>
                    <button
                        className='db-config-button'
                        onClick={handleLoadPlan}
                    >
                        Load Plan
                    </button>
                </div>
            </div>
        </div>
    )
}

DatabaseConfig.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onLoadPlan: PropTypes.func.isRequired,
}

export default DatabaseConfig
