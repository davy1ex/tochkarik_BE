import React from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import './Header.css';

import coin from '../../../public/coin.svg'
import explore from '../../../public/explore.svg'
import browse from '../../../public/browse.svg'

import BigBtn from "../buttons/Button.jsx";

const Header = ({user_login}) => {
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleJoinInClick = () => {
        navigate('/login'); // Redirect to /login
    };

    const showJoinInButton = location.pathname !== '/login';

    return (
        <header className="header">
            {user_login ? (
                <div className="menu-icon" onClick={() => navigate("/profile")}>
                    ☰
                </div>
            ) : (<></>)

            }

            <a className="logo" onClick={() => navigate("/")}>
                <div className={"logo-image"}><img src={"../../../public/logo.svg"}/></div>
                Tochkarik
            </a>

            <div className={"headerContainer"}>
                {user_login ? (
                    <>
                        <a className="points" onClick={() => alert('Перейти в магазин')}>
                            300 <span className="icon"> <img src={coin} alt=""/> </span>
                        </a>
                        <a to="/generate" className="icon">
                            <img src={explore} />
                        </a>
                        <a to="/posts" className="icon">
                            <img src={browse}/>
                        </a>
                    </>
                ) :

                (
                    showJoinInButton && (
                        <BigBtn onClick={handleJoinInClick}>Join In</BigBtn>
                    )
                )
                }
            </div>

        </header>
    );
};

export default Header;