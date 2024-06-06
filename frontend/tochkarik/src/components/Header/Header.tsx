import React, { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

import coin from '../../../public/coin.svg';
import explore from '../../../public/explore.svg';
import browse from '../../../public/browse.svg';

import BigBtn from "../buttons/Button";

interface HeaderProps {
    user_login: boolean;
}

const Header: FC<HeaderProps> = ({ user_login }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleJoinInClick = () => {
        navigate('/login');
    };

    const showJoinInButton = location.pathname !== '/login';

    return (
        <header className="header">
            {user_login && (
                <div className="menu-icon" onClick={() => navigate("/profile")}>
                    ☰
                </div>
            )}

            <a className="logo" onClick={() => navigate("/")}>
                <div className="logo-image">
                    <img alt="icon logo" src="../../../public/logo.svg" />
                </div>
                TochKarik
            </a>

            <div className="headerContainer">
                {user_login ? (
                    <>
                        <a className="points" onClick={() => alert('Перейти в магазин')}>
                            300 <span className="icon"><img src={coin} alt="" /></span>
                        </a>
                        <a className="icon" onClick={() => navigate("/generate")}>
                            <img alt="icon explore" src={explore} />
                        </a>
                        <a className="icon" onClick={() => navigate("/posts")}>
                            <img alt="icon browse posts" src={browse} />
                        </a>
                    </>
                ) : (
                    showJoinInButton && (
                        <BigBtn onClick={handleJoinInClick}>Join In</BigBtn>
                    )
                )}
            </div>
        </header>
    );
};

export default Header;
