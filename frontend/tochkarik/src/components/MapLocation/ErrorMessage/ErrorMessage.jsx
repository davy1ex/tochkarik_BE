import React from 'react';

import './ErrorMessage.css'

const ErrorMessage = ({ message }) => (
    <div className="error-message">
        {message}
    </div>
);

export default ErrorMessage;
