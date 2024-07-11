import axios from 'axios';
import { validateTokenSuccess, validateTokenFailure } from './authSlice';

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
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/validate_token`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            dispatch(validateTokenSuccess(response.data));
        } catch (error) {
            dispatch(validateTokenFailure());
        }
    } else {
        dispatch(validateTokenFailure());
    }
};

