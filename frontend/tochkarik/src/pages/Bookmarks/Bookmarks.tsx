import {FC, useEffect, useState} from 'react';
import {axiosInstance, setAuthToken} from '../../hooks/axiosConfig';

import GeneratedPoint from "../../components/Map/GeneratedPoint/GeneratedPoint";
import MapComponent from "../../components/Map/MapComponent";

import './Bookmarks.css'
import '../../components/Map/Map.css'
import "../../components/Map/GeneratedPoint/GeneratedPoint.css";

interface Bookmark {
    id: number;
    name: string;
    coordinates: [number, number];
    timeOfGenerate: string;
    description: string;
}

const Bookmarks: FC = () => {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);

    const fetchBookmarks = () => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');

        if (token) {
            setAuthToken(token);
        }

        axiosInstance.get('/points', {
            params: {
                'user_id': user_id,
            }
        }).then(response => {
            setBookmarks(response.data.points);
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    const handleCancel = () => {
        setSelectedBookmark(null);
        fetchBookmarks();
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handlePointDeletion = (pointId: number | null) => {
        if (pointId) {
            setBookmarks(bookmarks.filter(bookmark => bookmark.id !== pointId));
            setSelectedBookmark(null);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data: {error}</p>;

    return (
        <div className={"bookmarks-container"}>
            {!selectedBookmark ? (
                bookmarks.length > 0 ? (
                    bookmarks.map((bookmark) => (
                        <div key={bookmark.id} onClick={() => setSelectedBookmark(bookmark)} className="bookmarks-item">
                            <div className="bookmark-title">{bookmark.name}</div>
                            <div className="bookmark-date">{bookmark.timeOfGenerate}</div>
                        </div>
                    ))
                ) : (
                    <>
                        <p>You do not have any bookmarks :c</p>
                        <p>But u cannot create it in <a href={"/"} style={{
                            color: "#a2b8ff !important",
                            textDecoration: "underline"
                        }}>generate page</a>!</p>
                    </>
                )
            ) : (
                <>
                    <MapComponent
                        coordinates={selectedBookmark.coordinates}
                        showRadius={false}
                        radius={0}
                        centerPosition={selectedBookmark.coordinates}
                    />

                    <GeneratedPoint
                        pointId={selectedBookmark.id}
                        pointTitle={selectedBookmark.name}
                        street={selectedBookmark.description}
                        coordinates={selectedBookmark.coordinates}
                        timeOfGenerate={selectedBookmark.timeOfGenerate}

                        isNew={false}  // Assuming it's not a new point since it's already bookmarked
                        hasReport={false}  // Adjust based on your logic if report exists

                        onCancel={handleCancel}
                        onCreateReport={() => { /* Implement create report logic */ }}
                        onEditReport={() => { /* Implement edit report logic */ }}
                        onSave={handlePointDeletion}
                    />
                </>
            )}
        </div>
    );
}

export default Bookmarks;
