// src/pages/UserProfile/UserProfile.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../Style.css';
import './UserProfile.css';

import BigBtn from '../../components/buttons/Button.jsx';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const url = `${apiUrl}/api/user/${userId}`;
        console.log('Token retrieved from localStorage:', token);  // Добавьте эту строку

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
        <div className={'container-user-profile'}>
            <div>
                {'< Profile'}
            </div>
            <div className={'content-container'}>
                <div className={'container-profile'}>
                    {user && (
                        <>
                            <p>@{user.username}</p>
                        </>
                    )}
                </div>
                <div className={'container-buttons'}>
                    <BigBtn>Edit profile</BigBtn>
                    <BigBtn>My posts</BigBtn>
                    <BigBtn>My bookmarks</BigBtn>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
