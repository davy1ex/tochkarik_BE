import React from 'react';
import {Navigate} from 'react-router-dom';


const PublicRoute = ({component: Component, isAuthenticated, ...rest}) => {
    return isAuthenticated ? <Navigate to="/"/> : <Component {...rest} />;
};


export default PublicRoute