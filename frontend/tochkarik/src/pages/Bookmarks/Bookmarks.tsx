import React, {FC, useEffect, useState} from 'react'
import {axiosInstance, setAuthToken} from '../../hooks/axiosConfig'

import './Bookmarks.css'


interface Bookmark {
    id: number;
    name: string;
    coordinates: [number, number];
    timeOfGenerate: string;
    description: string;
}

const Bookmarks: FC = () =>  {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
        }

        axiosInstance.get('/user/get_points', {
            params: {
                'user_id': 1,
            }
        }).then(response => {
            console.log(response.data.points),
            console.log(response.data.points[0]),
            console.log(response.data),
            setBookmarks(response.data.points),
            setLoading(false)
        },)
        // setBookmarks(response)


    })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data: {error}</p>;

    return (
        <div className={"bookmarks-container"}>
            {
                bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="bookmarks-item">
                    <div className="bookmark-title">{bookmark.name}</div>
                    <div className="bookmark-date">{bookmark.timeOfGenerate}</div>
                </div>
            ))}
                {/*<div className={"bookmarks-item"}>*/}
                {/*    <div className={"bookmark-title"}>Bookmark1</div>*/}
                {/*    <div className={"bookmark-date"}>01-01-0101</div>*/}
                {/*</div>*/}

                {/*<div className={"bookmarks-item"}>*/}
                {/*    <div className={"bookmark-title"}>Bookmark2</div>*/}
                {/*    <div className={"bookmark-date"}>02-02-0102</div>*/}
                {/*</div>*/}
        </div>
    )
}

export default Bookmarks