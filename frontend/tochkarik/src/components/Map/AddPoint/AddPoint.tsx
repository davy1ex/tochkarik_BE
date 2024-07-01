import React, {ChangeEvent, useState} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import {axiosPrivateInstance, setAuthToken} from '../../../services/authService';


interface AddPointProps {
    addButtonCancelHandler: () => void;
    position: [number, number] | null;
    timeOfGenerate: string | null;
    onSave: (pointId: number) => void;
}

/**
 * Renders a component for adding a new point with a dialog box.
 *
 * @param {Function} addButtonCancelHandler - The handler for cancelling the addition of a point.
 * @param {Object} position - The position of the new point.
 * @param {Date} timeOfGenerate - The time when the point was generated.
 * @param {Function} onSave - The handler for saving the new point.
 */
const AddPoint: React.FC<AddPointProps> = ({addButtonCancelHandler, position, timeOfGenerate, onSave}) => {
    const [inputName, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(true);

    /**
     * Closes the dialog and calls the `addButtonCancelHandler` function.
     *
     * @return {void}
     */
    const handleClose = () => {
        setOpen(false);
        addButtonCancelHandler();
    };

    /**
     * Handles saving a new point to the server.
     *
     * @return {Promise<void>} Promise that resolves when the point is successfully saved.
     */
    const addButtonSaveHandler = async () => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        if (token) {
            setAuthToken(token);
        }

        setLoading(true);
        axiosPrivateInstance.post('/points', {
            user_id: user_id,
            name: inputName,
            coordinates: position,
            timeOfGenerate: timeOfGenerate,
        })
            .then(response => {
                console.log('Response from server:', response.data);
                onSave(response.data.data.id);
                setLoading(false);
                setError(null);
                handleClose();
                console.log(response)
            })
            .catch(() => {
                setLoading(false);
                setError('Error occurred while saving the point.');
            });
    };

    /**
     * Updates the state with the new value of the input field.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The event object containing the new value.
     * @return {void}
     */
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Point</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the name for the new point.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Point Name"
                    type="text"
                    fullWidth
                    value={inputName}
                    onChange={handleNameChange}
                />
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{error}</p>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={addButtonSaveHandler} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddPoint;
