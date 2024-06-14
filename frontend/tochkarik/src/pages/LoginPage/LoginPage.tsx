import React, {ChangeEvent, FC, FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {axiosInstance} from '../../hooks/axiosConfig';

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
            const response = await axiosInstance.post(`/login_check`, {
                username,
                password,
            });

            const token = response.data.token;
            const user_id = response.data.user_data.user_id;
            console.log(user_id)
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);

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
                        placeholder={"Login"}
                        required
                    />
                </div>
                <div className="login-container-item">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={"Password"}
                        required
                    />
                </div>

                <button onClick={handleSubmit}>Login</button>
                <a href="/reg">Sign Up</a>
                <p>Or u cannot go to <a href={"/"} style={{
                    color: "#a2b8ff !important",
                    textDecoration: "underline"
                }}>Home page</a> without authorization!</p>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
