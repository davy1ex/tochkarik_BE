import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const apiUrl = process.env.VITE_API_URL;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: `${apiUrl}/api`,
});

const setAuthToken = (token: string | null): void => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
}

const clearAuthTokens = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
}

const refreshToken = async (): Promise<string | null> => {
    try {
        const params = new URLSearchParams();
        params.append('refresh_token', localStorage.getItem('refresh_token') || '');
        params.append('token', localStorage.getItem('token') || '');

        const response = await axiosInstance.post('/token/refresh', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })


        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        return response.data.token;
    } catch (error) {
        clearAuthTokens();

        return null;
    }

};

const checkTokenValidity = async (handleLogout: () => void): Promise<boolean> => {
    try {
        await axiosInstance.get('/auth/check_token');
        return true;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {

            const newToken = await refreshToken();
            if (newToken) {
                setAuthToken(newToken);
                return true;
            } else {
                clearAuthTokens();
                handleLogout();
                return false;
            }
        }
        return false;
    }
};

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (status === 401 && error.response?.data && (error.response.data as any).message === "Expired JWT Token" && originalRequest) {
            originalRequest._retry = true;
            const newToken = await refreshToken();
            if (newToken) {
                setAuthToken(newToken);

                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                } else {
                    originalRequest.headers = {"Authorization": `Bearer ${newToken}`};
                }

                return axiosInstance(originalRequest);
            } else {
                window.location.href = '/401';
                return Promise.reject(error);
            }
        }

        if (!error.response) {
            // window.location.href = '/502';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export {axiosInstance, setAuthToken, checkTokenValidity};
