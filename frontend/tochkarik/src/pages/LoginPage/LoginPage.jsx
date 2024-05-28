import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


import '../../components/InputField/InputField.css'
import "./LoginPage.css"

const LoginPage = ({ setAuthToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Use useNavigate for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:50000/api/auth/signin', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            setAuthToken(token);

            navigate('/'); // Redirect user after successful login
        } catch (error) {

            setError('Invalid credentials ' + error);
        }
    };

    return (
        <div className={"login-container"}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className={"login-container-item"}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={"login-container-item"}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>

                <a href="/reg">Sign Up</a>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
