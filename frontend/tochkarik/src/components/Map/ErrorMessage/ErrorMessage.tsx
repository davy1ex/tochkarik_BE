import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="error-message">
        {message}
    </div>
);

export default ErrorMessage;