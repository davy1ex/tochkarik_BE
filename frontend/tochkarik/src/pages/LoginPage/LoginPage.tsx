import {ChangeEvent, FC, FormEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setRefreshToken, setToken} from '../../store/authSlice';

import axios from 'axios';

import '../../components/InputField/InputField.css';
import "./LoginPage.css";


interface ErrorResponse {
    message: string;
}


/**
 * Handles the form submission for user login.
 *
 * @param {FormEvent<HTMLFormElement>} event - The form submission event.
 * @return {void} No return value.
 */
const LoginPage: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    /**
     * Handles the form submission for user login.
     *
     * @param {FormEvent<HTMLFormElement>} event - The form submission event.
     * @return {void} No return value.
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const API_URL = process.env.VITE_API_URL + '/api'

        try {
            const response = await axios.post(`${API_URL}/login_check`, {
                username,
                password,
            });

            const {token} = response.data;
            const {refresh_token} = response.data;

            dispatch(setToken(token));
            dispatch(setRefreshToken(refresh_token));

            navigate('/')
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

    /**
     * Updates the state with the new value of the username input field.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The event object containing the new value.
     * @return {void}
     */
    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    /**
     * Updates the state with the new value of the password input field.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The event object containing the new value.
     * @return {void}
     */
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
