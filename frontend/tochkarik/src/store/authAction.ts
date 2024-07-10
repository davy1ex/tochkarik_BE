import axios from 'axios';

export const login = (username: string, password: string) => async dispatch => {
    try {
        const response = await axios.post(`${process.env.VITE_API_URL}/api/login_check`, {
            username,
            password
        });
        dispatch({type: 'LOGIN_SUCCESS', payload: response.data});
    } catch (error) {
        dispatch({type: 'LOGIN_FAILURE', error: error.response});
    }
};

export const validateToken = () => async dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch({type: 'VALIDATE_TOKEN_FAILURE'});
        return;
    }


    try {
        const response = await axios.get(`${process.env.VITE_API_URL}/api/auth/check_token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch({type: 'VALIDATE_TOKEN_SUCCESS', payload: response.data});
    } catch (error) {
        dispatch({type: 'VALIDATE_TOKEN_FAILURE'});
        localStorage.removeItem('token');
    }
};

