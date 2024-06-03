import React from 'react';

const Error404 = () => {
    return (
        <div>
            <h1>401 - Unauthorized Error</h1>
            <p>Way <a href={"/login"}>back</a> and try again!</p>
        </div>
    );
};

export default Error404;
