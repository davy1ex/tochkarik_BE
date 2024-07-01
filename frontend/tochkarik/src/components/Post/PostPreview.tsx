import {FC} from "react";
import {useNavigate} from "react-router-dom";


interface PostPreviewProps {
    userPhoto?: string;
    username?: string;
    postTitle?: string;
    postDesc?: string;
}

/**
 * Renders a preview of a post with user information, post details, and interaction features.
 *
 * @param {string} userPhoto - The URL of the user's profile photo.
 * @param {string} username - The username of the post author.
 * @param {string} postTitle - The title of the post.
 * @param {string} postDesc - The description of the post.
 * @return {JSX.Element} The JSX element representing the post preview.
 */
const PostPreview: FC<PostPreviewProps> = ({
    userPhoto = '',
    username = '',
    postTitle = '',
    postDesc = ''
}) => {
    const postPointOpenImg = '';
    const postShareImg = 'https://via.placeholder.com/20';
    const postLikeImg = 'https://via.placeholder.com/20';
    const postCommentCountImg = 'https://via.placeholder.com/20';

    const navigate = useNavigate();

    const redirectToPost = () => {
        navigate('/post')
    }

    return (
        <div className={"post-item"}
             onClick={() => redirectToPost()}>
            <div className={"post-header"}>
                <div className={"post-user-info-container"}>
                    <div className={"post-user-photo"}>
                        <img src={userPhoto} alt={"user-photo"}/>
                    </div>

                    <div className={"post-user-username"}>
                        {username}
                    </div>
                </div>

                <div className={"post-features-container"}>
                    <div className={"post-point-open"}>
                        <img src={postPointOpenImg} alt={"post point open in map"}/>
                    </div>
                    <div className={"post-share"}>
                        <img src={postShareImg} alt={"post share"}/>
                    </div>
                </div>
            </div>

            <div className={"post-body"}>
                <div className={"post-title"}>
                    {postTitle}
                </div>

                <div className={"post-desc"}>
                    {postDesc}
                </div>
            </div>

            <div className={"post-footer"}>
                <div className={"post-like"}>
                    <img src={postLikeImg} alt={"post point open in map"}/>
                </div>

                <div className={"post-count-comment"}>
                    <img src={postCommentCountImg} alt={"post comment count"}/>
                </div>
            </div>
        </div>
    );
}


export default PostPreview;