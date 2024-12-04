import React, {FC} from 'react';

const Error404: FC = () => {
    return (
        <div>
            <h1>Error 404: Not Found</h1>
            <p>But u cannot create it in <a href={"/"} style={{
                color: "#a2b8ff !important",
                textDecoration: "underline"
            }}>generate page</a>!</p>
        </div>
    );
}

export default Error404;
