import React from 'react';
import {Navigate} from 'react-router-dom';


const PrivateRoute = ({component: Component, isAuthenticated, ...rest}) => {
    return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login"/>;
};


export default PrivateRoute