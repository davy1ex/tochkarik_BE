import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
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

    const apiUrl = process.env.VITE_API_URL;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== password_repeat) {
            setError('Password do not match! Try again');
            return;
        }

        const cyrillicPattern = /[А-Яа-яЁё]/;

        if (cyrillicPattern.test(username) || cyrillicPattern.test(password)) {
            setError('Username and password must not contain Cyrillic characters.');
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
                if (error.response.status === 400) {
                    setError('Username already exists. Please choose another one.');
                } else {
                    setError(`Error: ${error.response.data.message}`);
                }
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
                <p style={{color: "lightgray"}}>Or u can go to <a href={"/"} style={{
                    color: "#a2b8ff !important",
                    textDecoration: "underline"
                }}>Home page</a> without authorization!</p>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default RegistrationPage;
