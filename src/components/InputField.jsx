import React from 'react'
import PropTypes from 'prop-types'

function InputField({ label, type, value, onChange, step }) {
    return (
        <div className='input-field'>
            <label>{label}</label>
            <input type={type} value={value} onChange={onChange} step={step} />
        </div>
    )
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.func.isRequired,
}

export default InputField
