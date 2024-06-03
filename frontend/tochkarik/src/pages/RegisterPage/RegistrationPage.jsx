import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../../components/InputField/InputField.css'
import './RegisterPage.css'

const RegistrationPage = ({  }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_repeat, setPasswordRepeat] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== password_repeat) {
            setError('Password do not match! Try again');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/auth/signup`, {
                username,
                password,
            });
            navigate('/login');
        }
        catch (error) {
            if (error.response) {
                // Сервер ответил с кодом состояния, который выходит за пределы 2xx
                console.error('Error response:', error.response);
                setError(`Error: ${error.response.statusText}`);
            } else if (error.request) {
                // Запрос был сделан, но ответа не получено
                console.error('Error request:', error.request);
                setError('No response received from server.');
            } else {
                // Что-то пошло не так при настройке запроса
                console.error('Error message:', error.message);
                setError(`Error: ${error.message}`);
            }
        }
    }

    return (
        <div className={"register-container"}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className={"register-container-item"}>
                    <label>Login</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Login"
                    />
                </div>

                <div className={"register-container-item"}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />

                    <input
                        type="password"
                        value={password_repeat}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        required
                        placeholder="Repeat password"
                    />
                </div>
                    <button type="submit">Sign Up</button>
                    <a href="/login">Sign In</a>


                    {error && <p>{error}</p>}
            </form>
        </div>
)
}


export default RegistrationPage
