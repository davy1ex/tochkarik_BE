import {FC} from 'react';
import MapComponent from '../../components/Map/MapComponent'
import './Post.css'


interface Post {
    id: number;
    name: string;
    postTitle: string;
    coordinates: [number, number];
    description: string;
    username?: string;
    postDesc?: string;
}


/**
 * Define the Post component with specified props.
 *
 * @param {Post} id - The unique identifier for the post
 * @param {string} name - The name of the post (default: 'bookmark1')
 * @param {string} postTitle - The title of the post
 * @param {number[]} coordinates - The coordinates for the post location (default: [42, 42])
 * @param {string} description - The description of the post
 * @param {string} username - The username associated with the post
 * @param {string} postDesc - The detailed description of the post
 * @param {string} linkToBack - The link to navigate back to the home page
 * @return {JSX.Element} The JSX element representing the Post component
 */
const Post: FC<Post> = ({
    id,
    name='bookmark1',
    postTitle,
    coordinates=[42,42],
    description="jfoiasfj oisaejf s;fj s;klf jsf;lksj dafia esjfioes mfkl",
    username,
    postDesc,
    linkToBack,
}) => {


    return (
        <div className={"post-container"}>
            <div className={"navigation-back"}>
                <a href={linkToBack}>{"< back Home"}</a>
            </div>
            <div className={"post-map"}>
                <MapComponent
                    coordinates={coordinates}
                    showRadius={false}
                    radius={0}
                    centerPosition={coordinates}
                />
            </div>

            <div className={"post-description"}>
                {description}
            </div>
        </div>
    );
}


export default Post;