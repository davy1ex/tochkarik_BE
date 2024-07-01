import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.VITE_API_URL;

const axiosPublicInstance: AxiosInstance = axios.create({
    baseURL: `${API_URL}/public/api`,
});

const axiosPrivateInstance: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
});


/**
 * Sets the authorization token in the axiosPrivateInstance's default headers.
 *
 * @param {string | null} token - The token to be set as the authorization header. If null, the authorization header is deleted.
 * @return {void} This function does not return anything.
 */
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosPrivateInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosPrivateInstance.defaults.headers.common["Authorization"];
    }
};

/**
 * Refreshes the authentication token.
 *
 * @return {Promise<string | null>} A promise that resolves to the new token if successful, or null if the refresh failed.
 * @throws {Error} If no refresh token is available.
 */
export const refreshToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error("No refresh token available");

    axiosPrivateInstance.post('/token/refresh', {
        refresh_token: refreshToken,
    }).then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        setAuthToken(response.data.token);
        return response.data.token;
    }).catch( error => {
        console.error("Failed to refresh token", error);
        clearAuthTokens();
        logoutHandler()
        return null;
    })
};

/**
 * Clears the authentication tokens from the local storage and sets the authorization token in the axiosPrivateInstance's default headers to null.
 *
 * @return {void} This function does not return anything.
 */
export const clearAuthTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setAuthToken(null);
    window.location.href = '/';
};

/**
 * Handles the logout process.
 *
 * @return {void} This function does not return anything.
 */
const logoutHandler = () => {
    if (window.location.pathname !== '/login') {
        clearAuthTokens();
        window.location.href = '/login';
    }
};

/**
 * Interceptor for handling responses in axiosPrivateInstance.
 *
 * @param {Object} response - The response object.
 * @param {Object} error - The error object.
 * @return {Promise} A Promise that resolves the response or rejects the error.
 */
axiosPrivateInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            const originalRequest = error.config;
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    console.log('Attempting to refresh token.');
                    const newToken = await refreshToken();
                    if (newToken) {
                        console.log('Token refreshed successfully.');
                        axiosPrivateInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return axiosPrivateInstance(originalRequest);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed, logging out.');
                    logoutHandler();
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export { axiosPublicInstance, axiosPrivateInstance };