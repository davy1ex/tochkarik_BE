import React from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import './Header.css';

import coin from '../../../public/coin.svg'

const Header = () => {
    const navigate = useNavigate(); // Use useNavigate for navigation

    return (
        <header className="header">
            <div className="menu-icon" onClick={() => navigate("/profile")}>
                ☰
            </div>
            <a className="logo" onClick={() => navigate("/")}>
                <div className={"logo-image"}><img src={"../../../public/logo.svg"}/></div>
                Tochkarik
            </a>

            <div className={"headerContainer"}>
                <a className="points" onClick={() => alert('Перейти в магазин')}>
                    300 <span className="icon"> <img src={coin} alt=""/> </span>
                </a>
                <a to="/generate" className="icon">
                    🧭
                </a>
                <a to="/posts" className="icon">
                    🌐
                </a>
            </div>

        </header>
    );
};

export default Header;