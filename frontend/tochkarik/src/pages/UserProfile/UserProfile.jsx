import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../Style.css'
import './UserProfile.css'

import BigBtn from '../../components/buttons/Button.jsx'

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Замените URL на тот, который используется для обращения к вашему Symfony-контейнеру
        const url = `http://localhost:50000/api/user/${userId}`;

        axios.get(url)
            .then(response => {
                setUser(response.data);
                console.log(response)
            })
            .catch(error => {
                setError(error.response ? error.response.data.message : 'Error fetching user');
            });
    }, [userId]);

    if (error) return <p>Error loading user data: {error.message}</p>;

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
