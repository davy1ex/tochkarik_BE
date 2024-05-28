import axios from 'axios';

const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // alert("Token is live");
    } else {
        delete axios.defaults.headers.common["Authorization"];
        // alert("Token is not live");
    }
}

export default setAuthToken;