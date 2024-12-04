import {FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setRefreshToken, setToken} from '../../store/authSlice';
import axios from 'axios';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import '../../components/InputField/InputField.css';
import './LoginPage.css';

interface ErrorResponse {
    message: string;
}

const LoginPage: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues = {
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
            username: Yup.string()
                .required('Username is required')
                .matches(/^[A-Za-z0-9]+$/, 'Username must not contain Cyrillic characters'),

            password: Yup.string()
                .required('Password is required')
                .matches(/^[A-Za-z0-9]+$/, 'Password must not contain Cyrillic characters'),
})
    ;

    const handleSubmit = async (values: typeof initialValues, {setSubmitting, setFieldError}) => {
        const API_URL = process.env.VITE_API_URL + '/api';

        try {
            const response = await axios.post(`${API_URL}/login_check`, values);
            const {token, refreshToken} = response.data;

            dispatch(setToken(token));
            dispatch(setRefreshToken(refreshToken));

            navigate('/');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorResponse = err.response?.data as ErrorResponse;
                setFieldError('general', errorResponse.message || 'Incorrect login data');
            } else {
                setFieldError('general', 'An unexpected error occurred');
            }
        }

        setSubmitting(false);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({isSubmitting, errors}) => (
                    <Form>
                        <div className="login-container-item">
                            <label htmlFor="username">Username:</label>
                            <Field
                                type="text"
                                name="username"
                                placeholder="Login"
                                required
                            />
                            <ErrorMessage name="username" component="div" className="error-message"/>
                        </div>
                        <div className="login-container-item">
                            <label htmlFor="password">Password:</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                            />
                            <ErrorMessage name="password" component="div" className="error-message"/>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            Login
                        </button>
                        <a href="/reg">Sign Up</a>
                        <p style={{color: 'lightgray'}}>
                            Or you can go to{' '}
                            <a href="/" style={{color: '#a2b8ff !important', textDecoration: 'underline'}}>
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

export default LoginPage;
