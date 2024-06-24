import {FC} from "react";
import {useNavigate} from "react-router-dom";

import PostPreview from "../../components/Post/PostPreview"




const UserPosts: FC = () => {
    const navigate = useNavigate();
    const redirect = (path: string) => {
        navigate(path);
    };


    return (
        <div className={"user-posts-container"}>
            <div className={"navigation"} onClick={() => {
                redirect('/profile'); }}>
                {"< Posts"}
            </div>

            <PostPreview />
            <PostPreview />
            <PostPreview />

        </div>
    );
}


export default UserPosts;