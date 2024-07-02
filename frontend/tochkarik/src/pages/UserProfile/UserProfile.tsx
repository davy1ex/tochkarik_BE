import React, {useEffect, useState} from 'react';
import { useNavigate  } from 'react-router-dom'
import {axiosPrivateInstance} from '../../services/authService';

import '../Style.css';
import './UserProfile.css';

import BigButton from '../../components/Buttons/BigButton';

interface UserProfileProps {
    userId: number;
    logoutHandler: () => void;
}

interface User {
    username: string;
}

/**
 * Renders the user profile page.
 *
 * @param {UserProfileProps} props - The props object containing the following properties:
 *   - userId: The ID of the user.
 *   - logoutHandler: The function to handle logout.
 * @return {JSX.Element} The rendered user profile page.
 */
const UserProfile: React.FC<UserProfileProps> = ({ userId, logoutHandler }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const redirect = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        axiosPrivateInstance.get(`/user/current_user`, {})
            .then(response => {
                if (!response.data) {
                    navigate('/');
                } else {
                    setUser(response.data);
                    setLoading(false);
                }
            }).catch(error => {
                navigate('/')
            })
        }, [userId, navigate]);

    const redirectToBookmarks = () => {
        navigate('/bookmarks');
    };

    const redirectToUserPosts = () => {
        navigate('/user_posts');
    };

    const redirectToAdminDashboard = () => {
        navigate('/admindashboard');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container-user-profile">
            <div onClick={() => {
                redirect('/')
            }}>
                {"< profile"}
            </div>
            <div className="content-container">
                {user && (
                    <>
                        <div className="container-profile">
                            <p>@{user.username}</p>
                        </div>
                        <div className="container-buttons">
                            <BigButton>Edit profile</BigButton>
                            <BigButton onClick={redirectToAdminDashboard}>Simillarik</BigButton>
                            <BigButton onClick={redirectToUserPosts}>My posts</BigButton>
                            <BigButton onClick={redirectToBookmarks}>My bookmarks</BigButton>
                            <BigButton onClick={logoutHandler}>Logout</BigButton>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
