import React from 'react'
import PropTypes from 'prop-types'

function InputField({ label, type, value, onChange, step, min }) {
    return (
        <div className='input-field'>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                step={step}
                min={min}
            />
        </div>
    )
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default InputField
