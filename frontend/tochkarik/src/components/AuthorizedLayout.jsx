import React from 'react';
import Header from './Header/Header';

const AuthorizedLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    );
};

export default AuthorizedLayout;