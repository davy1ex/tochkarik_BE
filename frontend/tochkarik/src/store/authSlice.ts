import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, User} from '../types';

const initialState: AuthState = {
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,

    isAuthenticated: !!localStorage.getItem('token'),
    loading: true,
    user: null
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },
        setAuthError: (state) => {
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            localStorage.setItem('token', action.payload || '');
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        setRefreshToken: (state, action: PayloadAction<string | null>) => {
            localStorage.setItem('refreshToken', action.payload || '');
            state.refreshToken = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        validateTokenSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.loading = false;
        },
        validateTokenFailure: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.token = null;
        },
        clearAuthState: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            localStorage.removeItem('refreshToken');
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        }
    },
});

export const {
    setUser,
    setAuthError,
    setToken,
    setRefreshToken,
    validateTokenSuccess,
    validateTokenFailure,
    clearAuthState
} = authSlice.actions;

export default authSlice.reducer;
