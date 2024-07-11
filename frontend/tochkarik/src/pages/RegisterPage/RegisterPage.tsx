import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { RegisterDTO } from '../../dto/RegisterDTO'; // Импортируем DTO

import '../../components/InputField/InputField.css';
import './RegisterPage.css';

interface RegistrationPageProps {
    setAuthToken: (token: string | null) => void;
}

const RegistrationPage: FC<RegistrationPageProps> = ({ setAuthToken }) => {
    const navigate = useNavigate();
    const apiUrl = process.env.VITE_API_URL;

    const initialValues: RegisterDTO = {
        username: '',
        password: '',
        password_repeat: ''
    };

    const validationSchema = Yup.object({
        username: Yup.string()
            .required('Username is required')
            .matches(/^[A-Za-z0-9]+$/, 'Username must not contain Cyrillic characters'),
        password: Yup.string()
            .required('Password is required')
            .matches(/^[A-Za-z0-9]+$/, 'Password must not contain Cyrillic characters'),
        password_repeat: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password')
    });

    const handleSubmit = async (values: RegisterDTO, { setSubmitting, setFieldError }) => {
        if (values.password !== values.password_repeat) {
            setFieldError('password_repeat', 'Passwords do not match!');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/auth/signup`, {
                username: values.username,
                password: values.password,
            });
            navigate('/login');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorResponse = err.response?.data as { message: string };
                if (err.response?.status === 400) {
                    setFieldError('general', `Error: ${errorResponse.message}`);
                }
            } else {
                setFieldError('general', 'An unexpected error occurred');
            }
        }

        setSubmitting(false);
    };

    return (
        <div className="register-container">
            <h2>Sign Up</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <div className="register-container-item">
                            <label htmlFor="username">Login</label>
                            <Field
                                type="text"
                                name="username"
                                placeholder="Login"
                                required
                            />
                            <ErrorMessage name="username" component="div" className="error-message" />
                        </div>

                        <div className="register-container-item">
                            <label htmlFor="password">Password</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <ErrorMessage name="password" component="div" className="error-message" />

                            <Field
                                type="password"
                                name="password_repeat"
                                placeholder="Repeat password"
                                required
                            />
                            <ErrorMessage name="password_repeat" component="div" className="error-message" />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Sign Up
                        </button>
                        <a href="/login">Sign In</a>
                        <p style={{ color: 'lightgray' }}>
                            Or you can go to{' '}
                            <a href="/" style={{ color: '#a2b8ff !important', textDecoration: 'underline' }}>
                                Home page
                            </a>{' '}
                            without authorization!
                        </p>

                        {errors.general && <p className="error-message">{errors.general}</p>}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegistrationPage;
