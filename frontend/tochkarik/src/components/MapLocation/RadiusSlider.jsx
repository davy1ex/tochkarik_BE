import React from 'react';

const RadiusSlider = ({ radius, handleRadiusChange }) => (
    <div>
        <input
            type="range"
            min="100"
            max="5000"
            value={radius}
            onChange={handleRadiusChange}
            className="slider"
        />
        <div>
            <span>{radius} meters</span>
        </div>
    </div>
);

export default RadiusSlider;
