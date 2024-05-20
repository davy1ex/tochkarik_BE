import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchUser = async () => {
    //         try {
    //             const response = await axios.get(`/api/user/${userId}`);
    //             setUser(response.data);
    //         } catch (err) {
    //             setError(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchUser();
    // }, [userId]);
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
        <div>
            <h1>User Profile</h1>
            {user && (
                <>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                </>
            )}
        </div>
    );
};

export default UserProfile;
