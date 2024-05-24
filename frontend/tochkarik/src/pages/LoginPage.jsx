import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import setAuthToken  from "../api.token.js";

const LoginForm = ({ setAuthStatus }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:50000/api/login_check', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            setAuthToken(token);

            navigate('/'); // Redirect user after successful login
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginForm;
