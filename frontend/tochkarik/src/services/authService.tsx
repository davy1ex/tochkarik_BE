import axios, {AxiosInstance} from 'axios';

interface AuthResponse {
    token: string;
    refreshToken: string;
}


const API_URL = process.env.VITE_API_URL
const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
});


export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

export const refreshToken = async (): Promise<string | null> => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axiosInstance.post<AuthResponse>('/token/refresh', {
            refresh_token: refreshToken,
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refreshToken);
        setAuthToken(response.data.token);
        return response.data.token;
    } catch (error) {
        console.error("Failed to refresh token", error);
        clearAuthTokens();
        return null;
    }
};

export const clearAuthTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    setAuthToken(null);
    window.location.href = '/';
};

const logoutHandler = () => {
    clearAuthTokens();
    window.location.href = '/login';
};


axiosInstance.interceptors.response.use(
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
                        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        return axiosInstance(originalRequest);
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

export default axiosInstance;