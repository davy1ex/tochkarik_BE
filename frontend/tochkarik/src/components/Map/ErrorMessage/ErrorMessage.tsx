import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
    message: string;
}

/**
 * Renders an error message component.
 *
 * @param {ErrorMessageProps} props - The props object containing the message to be displayed.
 * @param {string} props.message - The error message to be displayed.
 * @return {ReactElement} The rendered error message component.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="error-message">
        {message}
    </div>
);

export default ErrorMessage;
