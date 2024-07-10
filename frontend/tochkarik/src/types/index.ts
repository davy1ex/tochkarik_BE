export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: User | null;
}
