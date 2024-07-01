import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

interface LogoutProps {
    logoutHandler: () => void;
}

/**
 * Renders a component that logs out the user and redirects them to the login page.
 *
 * @param {LogoutProps} props - The component props.
 * @param {() => void} props.logoutHandler - The function to handle the logout.
 * @return {React.ReactElement | null} Returns null as this component does not render anything.
 */
const Logout: React.FC<LogoutProps> = ({logoutHandler}) => {
    const navigate = useNavigate();

    useEffect(() => {
        logoutHandler();  // Clear the session, tokens etc.
        navigate('/login');
    }, [logoutHandler, navigate]);

    return null;
};

export default Logout