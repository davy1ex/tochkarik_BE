import React from 'react';
import './RadiusSlider.css';

interface RadiusSliderProps {
    radius: number;
    handleRadiusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadiusSlider: React.FC<RadiusSliderProps> = ({ radius, handleRadiusChange }) => (
    <div className="slider-container">
        <input
            type="range"
            min="100"
            max="5000"
            value={radius}
            onChange={handleRadiusChange}
            className="slider"
        />
        <div className={"slider-component"}>{radius} meters</div>
    </div>
);

export default RadiusSlider;
