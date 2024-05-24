import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import coin from '../../../public/coin.svg'

const Header = () => {
    return (
        <header className="header">
            <div className="menu-icon" onClick={() => alert('Пример меню')}>
                ☰
            </div>
            <a className="logo">
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