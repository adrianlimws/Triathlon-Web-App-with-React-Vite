import React from 'react'
import PropTypes from 'prop-types'

function SortAndSearch({
    sortCriteria,
    onSortChange,
    searchQuery,
    onSearchInputChange,
    onSearch,
}) {
    return (
        <div className='sort-search'>
            <div className='sort-section'>
                <label htmlFor='sortCriteria'>Sort by: </label>
                <select
                    id='sortCriteria'
                    value={sortCriteria}
                    onChange={onSortChange}
                >
                    <option value='date'>Date</option>
                    <option value='distance'>Distance</option>
                    <option value='duration'>Duration</option>
                </select>
            </div>

            <div className='search-section'>
                <input
                    type='text'
                    placeholder='Search workouts'
                    value={searchQuery}
                    onChange={onSearchInputChange}
                />
                <button onClick={onSearch}>Search</button>
            </div>
        </div>
    )
}

SortAndSearch.propTypes = {
    sortCriteria: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
    onSearchInputChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
}

export default SortAndSearch
