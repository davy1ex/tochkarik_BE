// src/api/auth.js
import axios from 'axios';

// Пример API запроса для авторизации пользователя
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post('/api/login', credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

// Пример API запроса для регистрации пользователя
export const registerUser = async (credentials) => {
    try {
        const response = await axios.post('/api/register', credentials);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};
