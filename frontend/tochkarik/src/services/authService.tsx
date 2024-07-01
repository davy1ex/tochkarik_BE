import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.VITE_API_URL;

const axiosPublicInstance: AxiosInstance = axios.create({
    baseURL: `${API_URL}/public/api`,
});

const axiosPrivateInstance: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
});


export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosPrivateInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosPrivateInstance.defaults.headers.common["Authorization"];
    }
};

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

export const clearAuthTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setAuthToken(null);
    window.location.href = '/';
};

const logoutHandler = () => {
    if (window.location.pathname !== '/login') {
        clearAuthTokens();
        window.location.href = '/login';
    }
};

// Interceptor for the private API instance
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