import React, {FC} from 'react';

const Error502: FC = () => {
    return (
        <div>
            <h1>Error 502: Bad Gateway</h1>
            <p>But u cannot create it in <a href={"/"} style={{
                color: "#a2b8ff !important",
                textDecoration: "underline"
            }}>generate page</a>!</p>
        </div>
    );
}

export default Error502;
