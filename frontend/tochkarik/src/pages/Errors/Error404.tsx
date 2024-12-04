import React from 'react';

const Error404 = () => {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <p>But u cannot create it in <a href={"/"} style={{
                color: "#a2b8ff !important",
                textDecoration: "underline"
            }}>generate page</a>!</p>
        </div>
    );
};

export default Error404;
