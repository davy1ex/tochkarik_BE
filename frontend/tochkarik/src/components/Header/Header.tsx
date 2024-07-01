import React, {FC} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Header.css';

import coin from '../../icons/coin.svg';
import logo from '../../icons/logo.svg';
import explore from '../../icons/explore.svg';
import browse from '../../icons/browse.svg';

import {useAuth} from '../../services/AuthContext';

import BigButton from "../Buttons/BigButton";


/**
 * Renders the header component.
 *
 * @return {JSX.Element} The header component.
 */
const Header: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {isAuthenticated} = useAuth();

    /**
     * Handles the click event for the "Join In" button.
     *
     * This function is called when the "Join In" button is clicked. It uses the `navigate` function from the `react-router-dom` library to navigate to the `/login` route.
     *
     * @return {void} This function does not return a value.
     */
    const handleJoinInClick = () => {
        navigate('/login');
    };

    const showJoinInButton = location.pathname !== '/login';

    return (
        <header className="header">
            {isAuthenticated && (
                <div className="menu-icon" onClick={() => navigate("/profile")}>
                    ☰
                </div>
            )}

            <a className="logo" onClick={() => navigate("/")}>
                <div className="logo-image">
                    <img alt="icon logo" src={logo}/>
                </div>
                TochKarik
            </a>

            <div className="headerContainer">
                {isAuthenticated ? (
                    <>
                        <a className="points" onClick={() => alert('Перейти в магазин')}>
                            300 <span className="icon"><img src={coin} alt="" /></span>
                        </a>
                        <a className="icon" onClick={() => navigate("/generate")}>
                            <img alt="icon explore" width="22" src={explore}/>
                        </a>
                        <a className="icon" onClick={() => navigate("/posts")}>
                            <img alt="icon browse posts" src={browse} />
                        </a>
                    </>
                ) : (
                    showJoinInButton && (
                        <BigButton onClick={handleJoinInClick}>Join In</BigButton>
                    )
                )}
            </div>
        </header>
    );
};

export default Header;
