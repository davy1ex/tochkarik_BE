import React, {FC, ReactNode} from 'react';
import "./BigButton.css";

interface BigButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

/**
 * Renders a big button component with the provided children and onClick event handler.
 *
 * @param {ReactNode} children - The content to be displayed inside the button.
 * @param {() => void} [onClick] - The event handler for when the button is clicked.
 * @return {JSX.Element} The rendered big button component.
 */
const BigButton: FC<BigButtonProps> = ({children, onClick}) => {
    return (
        <button onClick={onClick} className="bigBtn">
            {children}
        </button>
    );
};

export default BigButton;
