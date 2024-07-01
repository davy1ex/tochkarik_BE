import {ChangeEvent, FC, FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import axios from 'axios';
import {useAuth} from '../../services/AuthContext';

import '../../components/InputField/InputField.css';
import "./LoginPage.css";


interface LoginPageProps {
    setAuthToken: (token: string | null) => void;
}

interface ErrorResponse {
    message: string;
}


const LoginPage: FC<LoginPageProps> = ({ setAuthToken }) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const {login} = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const API_URL = process.env.VITE_API_URL + '/api'

        try {
            const response = await axios.post(`${API_URL}/login_check`, {
                username,
                password,
            });

            const token = response.data.token;
            const refresh_token = response.data.refresh_token;

            login(token);

            localStorage.setItem('token', token);
            localStorage.setItem('refresh_token', refresh_token);

            setAuthToken(token);

            navigate('/');
            window.location.href = '/';
            window.location.reload();
        } catch (err) {
            console.log(err)
            if (axios.isAxiosError(err)) {
                const errorResponse = err.response?.data as ErrorResponse;
                setError(errorResponse.message || 'Incorrect login data');
            } else {
                setError('An unexpected error occurred');
            }
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

                <button>Login</button>
                <a href="/reg">Sign Up</a>
                <p style={{color: "lightgray"}}>Or u can go to <a href={"/"} style={{
                    color: "#a2b8ff !important",
                    textDecoration: "underline"
                }}>Home page</a> without authorization!</p>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
