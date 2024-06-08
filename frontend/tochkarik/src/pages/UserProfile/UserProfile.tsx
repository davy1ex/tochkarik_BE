import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
import {axiosInstance, setAuthToken} from '../../hooks/axiosConfig';

import '../Style.css';
import './UserProfile.css';

import BigBtn from '../../components/buttons/Button';

interface UserProfileProps {
    userId: number;
    logoutHandler: () => void;
}

interface User {
    username: string;
    // Добавьте другие поля пользователя, если они есть
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, logoutHandler }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const redirect = (path: string) => {
        navigate(path);
    };


    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const url = `${apiUrl}/api/user/${userId}`;

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.response ? error.response.data.message : 'Error fetching user');
                setLoading(false);
            });
    }, [userId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data: {error}</p>;

    return (
        <div className="container-user-profile">
            <div>
                {'< Profile'}
            </div>
            <div className="content-container">
                <div className="container-profile">
                    {user && (
                        <>
                            <p>@{user.username}</p>
                        </>
                    )}
                </div>
                <div className="container-buttons">
                    <BigBtn>Edit profile</BigBtn>
                    <BigBtn>My posts</BigBtn>
                    <BigBtn onClick={() => redirect('/bookmarks')}>My bookmarks</BigBtn>
                    <BigBtn onClick={logoutHandler}>Logout</BigBtn>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
