import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

interface LogoutProps {
    logoutHandler: () => void;
}

const Logout: React.FC<LogoutProps> = ({logoutHandler}) => {
    const navigate = useNavigate();

    useEffect(() => {
        logoutHandler();  // Clear the session, tokens etc.
        navigate('/login');
    }, [logoutHandler, navigate]);

    return null;
};

export default Logout