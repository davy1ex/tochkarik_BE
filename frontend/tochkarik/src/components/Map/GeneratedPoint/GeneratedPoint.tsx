import React, {useEffect, useState} from 'react';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import BigButton from '../../Buttons/BigButton';
import AddPoint from '../AddPoint/AddPoint';

import bookmark from '../../../icons/bookmark.svg';
import bookmarked from '../../../icons/bookmarked.svg';

import "./GeneratedPoint.css";
import '../Map.css';
import { axiosPrivateInstance } from "../../../services/authService";


interface GeneratedPointProps {
    pointId: number | null;
    street: string;
    pointTitle: string;
    isNew: boolean;
    hasReport: boolean;
    onCancel: () => void;
    onStartJourney?: () => void;
    onCreateReport?: () => void;
    onEditReport?: () => void;
    coordinates: [number, number] | null;
    timeOfGenerate: string;
    onSave: (id: number | null) => void;
}

/**
 * Renders a component for displaying a generated point with controls for starting a journey, creating a report, and bookmarking the point.
 *
 * @param {Object} props - The props object containing the following properties:
 *   - pointId: The ID of the generated point.
 *   - street: The street address of the generated point.
 *   - pointTitle: The title of the generated point.
 *   - isNew: A boolean indicating whether the generated point is new or not.
 *   - hasReport: A boolean indicating whether the generated point has a report or not.
 *   - onCancel: A function to handle cancellation of the generated point.
 *   - onStartJourney: A function to handle starting a journey to the generated point.
 *   - onCreateReport: A function to handle creating a report for the generated point.
 *   - onEditReport: A function to handle editing a report for the generated point.
 *   - coordinates: The coordinates of the generated point.
 *   - timeOfGenerate: The time when the generated point was generated.
 *   - onSave: A function to handle saving the generated point.
 * @return {JSX.Element} The rendered component.
 */
const GeneratedPoint: React.FC<GeneratedPointProps> = ({
   pointId,
   street,
   pointTitle,
   isNew,
   hasReport,
   onCancel,
   onStartJourney,
   onCreateReport,
   onEditReport,
   coordinates,
   timeOfGenerate,
   onSave
}) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showAddPointDialog, setShowAddPointDialog] = useState<boolean>(false);
    const [localPointId, setLocalPointId] = useState<number | null>(pointId);

    /**
     * Handles adding a bookmark by showing the add point dialog and setting the bookmark status.
     *
     * @return {void} No return value.
     */
    const handleAddBookmark = () => {
        setShowAddPointDialog(true);
        setIsBookmarked(true);
    };

    /**
     * Removes a bookmark from a point by sending a DELETE request to the server.
     *
     * @param {number | null} pointId - The ID of the point to remove the bookmark from.
     * @return {void} This function does not return anything.
     */
    const handleRemoveBookmark = (pointId: number | null) => {
        if (!pointId) {
            console.error("No pointId provided");
            return;
        }
        axiosPrivateInstance.delete(`/points/${pointId}`)
            .then(() => {
                setIsBookmarked(false);
                onSave(null);
                onCancel();
            })
            .catch(error => {
                console.error(`Error deleting point with ID: ${pointId}`, error);
            });
    }

    /**
     * Sets the state of `showAddPointDialog` to `false`, effectively closing the add point dialog.
     *
     * @return {void} This function does not return anything.
     */
    const addButtonCancelHandler = () => {
        setShowAddPointDialog(false);
    };

    /**
     * A function that handles saving the point with the given ID.
     *
     * @param {number} id - The ID of the point to be saved.
     * @return {void} No return value.
     */
    const handleSave = (id: number) => {
        console.log('on save ' + id)
        setLocalPointId(id);
        setIsBookmarked(true);
        onSave(id);
        setShowAddPointDialog(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogin(true)
        }
    }, [])

    /**
     * Opens a new tab in the user's browser with a Google Maps URL based on the provided coordinates.
     *
     * @return {void}
     */
    const defaultOnStartJourney = () => {
        if (coordinates) {
            const [lat, lon] = coordinates;
            window.location.href = `https://www.google.com/maps?q=${lat},${lon}`;
        }
    }

    return (
        <div className="controls-container-generated">
            <div className={"controls-wrapper-generated"}>
                <div className={"controls-header-container"}>
                    <h1 className={"point-title"}>{pointTitle}</h1>

                    {isLogin && <>{isBookmarked || !isNew ? (
                        <div className={"controls-header-img-container"}
                             onClick={() => handleRemoveBookmark(localPointId)}>
                            <img src={bookmarked} alt={"Bookmarked"}/>
                        </div>
                    ) : (
                        <div className={"controls-header-img-container"} onClick={handleAddBookmark}>
                            <img src={bookmark} alt={"Bookmark"}/>
                        </div>
                    )}</>}
                </div>

                <p>{street}</p>
                <div className="button-group">
                    <BigButton onClick={onStartJourney || defaultOnStartJourney}>Start Journey</BigButton>
                    {hasReport ? (
                        <BigButton onClick={onEditReport}>Edit Report</BigButton>
                    ) : (
                        <>{isLogin && <BigButton onClick={onCreateReport}>Create Report</BigButton>}</>
                    )}
                    <BigButton onClick={onCancel}>Cancel</BigButton>
                </div>
                {hasReport && <ErrorMessage message="Report exists"/>}
            </div>

            {showAddPointDialog && (
                <AddPoint
                    addButtonCancelHandler={addButtonCancelHandler}
                    position={coordinates}
                    timeOfGenerate={timeOfGenerate}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default GeneratedPoint;
