import { FC, useEffect, useState } from 'react';
import { axiosInstance, setAuthToken } from '../../hooks/axiosConfig';

import GeneratedPoint from "../../components/Map/GeneratedPoint/GeneratedPoint";
import MapComponent from "../../components/Map/MapComponent.tsx";

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
            setBookmarks(response.data.points);
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data: {error}</p>;

    return (
        <div className={"bookmarks-container"}>
            {!selectedBookmark ? (
                bookmarks.map((bookmark) => (
                    <div key={bookmark.id} onClick={() => setSelectedBookmark(bookmark)} className="bookmarks-item">
                        <div className="bookmark-title">{bookmark.name}</div>
                        <div className="bookmark-date">{bookmark.timeOfGenerate}</div>
                    </div>
                ))
            ) : (
                <>
                    <MapComponent
                    coordinates={selectedBookmark.coordinates}
                    showRadius={false}
                    radius={0}
                    centerPosition={selectedBookmark.coordinates}/>

                    <GeneratedPoint
                        street={selectedBookmark.description}  // Assuming 'description' contains street or change it to the appropriate field
                        pointTitle={selectedBookmark.name}
                        isNew={false}  // Assuming it's not a new point since it's already bookmarked
                        hasReport={false}  // Adjust based on your logic if report exists
                        onCancel={() => setSelectedBookmark(null)}
                        onStartJourney={() => { /* Implement start journey logic */ }}
                        onCreateReport={() => { /* Implement create report logic */ }}
                        onEditReport={() => { /* Implement edit report logic */ }}
                        name={selectedBookmark.name}
                        coordinates={selectedBookmark.coordinates}
                        timeOfGenerate={selectedBookmark.timeOfGenerate}
                    />
                </>
            )}
        </div>
    );
}

export default Bookmarks;
