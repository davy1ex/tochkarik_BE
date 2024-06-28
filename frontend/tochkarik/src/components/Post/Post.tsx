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