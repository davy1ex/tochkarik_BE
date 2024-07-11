import axios from 'axios';
import store from '../store/store';
import {clearAuthState, setToken} from "../store/authSlice";

const API_URL = process.env.VITE_API_URL;

const axiosPublicInstance = axios.create({
    baseURL: `${API_URL}/public/api`,
});

const axiosPrivateInstance = axios.create({
    baseURL: `${API_URL}/api`,
});

axiosPrivateInstance.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;
    console.log('hello from axios')
    console.log(state.auth.token)
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosPrivateInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = store.getState().auth.refreshToken;
                const res = await axios.post(`${API_URL}/api/token/refresh`, {refresh_token: refreshToken});
                store.dispatch(setToken(res.data.token));
                axiosPrivateInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                originalRequest.headers['Authorization'] = `Bearer ${res.data.token}`;
                return axiosPrivateInstance(originalRequest);
            } catch (refreshError) {
                store.dispatch(clearAuthState());
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export {axiosPublicInstance, axiosPrivateInstance};
