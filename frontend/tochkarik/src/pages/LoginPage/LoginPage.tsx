import React, { useState, FC, FormEvent, ChangeEvent } from 'react';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../../hooks/axiosConfig';


import '../../components/InputField/InputField.css';
import "./LoginPage.css";

interface LoginPageProps {
    setAuthToken: (token: string | null) => void;
}

const LoginPage: FC<LoginPageProps> = ({ setAuthToken }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post(`/auth/signin`, {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            setAuthToken(token);

            navigate('/');
        } catch (error: 404) {
            setError(error.response?.data?.message || 'Incorrect login data');
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div className="login-container-item">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                </div>
                <div className="login-container-item">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <a href="/reg">Sign Up</a>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
