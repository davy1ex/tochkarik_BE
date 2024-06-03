import axios from 'axios';


const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${apiUrl}/api`, // Замените на ваш URL
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const status = error.response ? error.response.status : null;
        if (status === 404) {
            window.location.href = '/404';
        } else if (status === 502) {
            window.location.href = '/502';
        }
        else if (status === 401) {
            window.location.href = '/401';
        } else if (status === 501) {
            window.location.href = '/501';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;