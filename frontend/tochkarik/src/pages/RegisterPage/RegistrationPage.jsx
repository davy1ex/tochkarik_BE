import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import './RegisterPage.css'

const RegistrationPage = ({  }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_repeat, setPasswordRepeat] = useState('');

    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== password_repeat) {
            setError('Password do not match! Try again');
            return;
        }

        try {
            const response = await axios.post('http://localhost:50000/api/auth/signup', {
                username,
                password,
            });
            navigate('/login');
        }
        catch (error) {
            console.log(error.response)
            setError('Registration failed: ' + (error.response.statusText))
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

                    {/*<label>Repeat pas</label>*/}
                    <input
                        type="password"
                        value={password_repeat}
                        // onChage={(e) => setUsername(e.target.value)}
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
