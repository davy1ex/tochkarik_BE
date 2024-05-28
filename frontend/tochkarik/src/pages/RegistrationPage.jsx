    import React, { useState } from 'react'
    import { useNavigate } from "react-router-dom";
    import axios from 'axios';


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
            <div>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={username}
                        // onChage={(e) => setUsername(e.target.value)}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Login"
                    />
                    <input
                        type="password"
                        value={password}
                        // onChage={(e) => setUsername(e.target.value)}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                    />
                    <input
                        type="password"
                        value={password_repeat}
                        // onChage={(e) => setUsername(e.target.value)}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        required
                        placeholder="Repeat password"
                    />

                    <button type="submit">Login</button>
                    {error && <p>{error}</p>}

                </form>
            </div>
        )
    }


    export default RegistrationPage
