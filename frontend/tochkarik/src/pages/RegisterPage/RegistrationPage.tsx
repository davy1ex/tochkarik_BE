import React, { useState, FC, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import '../../components/InputField/InputField.css';
import './RegisterPage.css';

interface RegistrationPageProps {
    setAuthToken: (token: string | null) => void;
}

const RegistrationPage: FC<RegistrationPageProps> = ({ setAuthToken }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password_repeat, setPasswordRepeat] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        } catch (error: any) {
            if (error.response) {
                console.error('Error response:', error.response);
                setError(`Error: ${error.response.statusText}`);
            } else if (error.request) {
                console.error('Error request:', error.request);
                setError('No response received from server.');
            } else {
                console.error('Error message:', error.message);
                setError(`Error: ${error.message}`);
            }
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handlePasswordRepeatChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordRepeat(e.target.value);
    };

    return (
        <div className="register-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="register-container-item">
                    <label>Login</label>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        placeholder="Login"
                    />
                </div>

                <div className="register-container-item">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Password"
                    />

                    <input
                        type="password"
                        value={password_repeat}
                        onChange={handlePasswordRepeatChange}
                        required
                        placeholder="Repeat password"
                    />
                </div>
                <button type="submit">Sign Up</button>
                <a href="/login">Sign In</a>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default RegistrationPage;
