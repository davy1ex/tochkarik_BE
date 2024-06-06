import React, { FC, ReactNode } from 'react';
import "./button.css";

interface BigBtnProps {
    children: ReactNode;
    onClick?: () => void;
}

const BigBtn: FC<BigBtnProps> = ({ children, onClick }) => {
    return (
        <button onClick={onClick} className="bigBtn">
            {children}
        </button>
    );
};

export default BigBtn;
