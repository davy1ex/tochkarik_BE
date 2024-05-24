import React from 'react';
import {Navigate} from 'react-router-dom';
import AuthorizedLayout from './AuthorizedLayout';


const RouteGuard = ({ component: Component, isAuthenticated, ...rest }) => {
    return isAuthenticated ? (
        <AuthorizedLayout>
            <Component {...rest} />
        </AuthorizedLayout>
    ) : (
        <Navigate to="/login" />
    );
};

export default RouteGuard;


// я пакость