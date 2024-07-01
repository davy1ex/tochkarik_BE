import React, {FC, ReactNode} from 'react';
import "./BigButton.css";

interface BigButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

const BigButton: FC<BigButtonProps> = ({children, onClick}) => {
    return (
        <button onClick={onClick} className="bigBtn">
            {children}
        </button>
    );
};

export default BigButton;
