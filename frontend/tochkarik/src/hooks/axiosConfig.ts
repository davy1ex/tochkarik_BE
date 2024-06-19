import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';


const apiUrl = import.meta.env.VITE_API_URL;

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

const refreshToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(`${apiUrl}/api/token/refresh`, {
            refresh_token: localStorage.getItem('refresh_token'),
        });
        return response.data.refresh_token;
    } catch (error) {
        console.error('Failed to refresh token', error);
        return null;
    }
};

const checkTokenValidity = async (): Promise<boolean> => {
    try {
        await axiosInstance.get('/auth/check_token');
        return true;
    } catch (error) {
        return false;
    }
};

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const status = error.response ? error.response.status : null;
        const originalRequest = error.config;


        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (status === 401 && error.response.data.message == "Expired JWT Token") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            originalRequest._retry = true;
            window.location.href = '/logout'


            const newToken = await refreshToken();
            if (newToken) {
                setAuthToken(newToken);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                return axiosInstance(originalRequest);
            } else {
                window.location.href = '/401';
                return Promise.reject(error);
            }
        }

        if (!error.response) {
            // if server error
            console.error('Network error: Backend is not responding');
            window.location.href = '/502'; // или другой маршрут для обработки ошибки сети
            return Promise.reject(error);
        }

        const currentPath = window.location.pathname;

        const showErrors = currentPath !== '/login' && currentPath !== '/reg';

        if (showErrors) {
            if (status === 404) {
                window.location.href = '/404';
            } else if (status === 502) {
                window.location.href = '/502';
            } else if (status === 401) {
                window.location.href = '/401';
            } else if (status === 501) {
                window.location.href = '/501';
            }
        }
        return Promise.reject(error);
    }
);

export {axiosInstance, setAuthToken, checkTokenValidity};
