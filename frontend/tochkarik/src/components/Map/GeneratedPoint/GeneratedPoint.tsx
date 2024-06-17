import React, {useEffect, useState} from 'react';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import BigButton from '../../Buttons/BigButton.tsx';
import AddPoint from '../AddPoint/AddPoint';

import bookmark from '../../../icons/bookmark.svg';
import bookmarked from '../../../icons/bookmarked.svg';

import "./GeneratedPoint.css";
import '../Map.css';


interface GeneratedPointProps {
    street: string;
    pointTitle: string;
    isNew: boolean;
    hasReport: boolean;
    onCancel: () => void;
    onStartJourney?: () => void;
    onCreateReport?: () => void;
    onEditReport?: () => void;

    coordinates: [number, number];
    timeOfGenerate: string;
}

const GeneratedPoint: React.FC<GeneratedPointProps> = ({
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

}) => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
    const [showAddPointDialog, setShowAddPointDialog] = useState<boolean>(false);

    const handleAddBookmark = () => {
        setShowAddPointDialog(true);
        setIsBookmarked(true);
    };

    const addButtonCancelHandler = () => {
        setShowAddPointDialog(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLogin(true)
        }
    })

    const defaultOnStartJourney = () => {
        const [lat, lon] = coordinates;
        window.location.href = `https://www.google.com/maps?q=${lat},${lon}\n`
    }

    return (
        <div className="controls-container-generated">
            <div className={"controls-wrapper-generated"}>
                <div className={"controls-header-container"}>
                    <h1 className={"point-title"}>{pointTitle}</h1>

                    {isLogin && <>{isBookmarked || !isNew ? (
                        <div className={"controls-header-img-container"}>
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
                />
            )}
        </div>
    );
};

export default GeneratedPoint;
