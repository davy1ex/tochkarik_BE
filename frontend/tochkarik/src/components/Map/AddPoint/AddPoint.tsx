import React, {ChangeEvent, useState} from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import {axiosInstance, setAuthToken} from '../../../hooks/axiosConfig';


interface AddPointProps {
    addButtonCancelHandler: () => void;
    position: [number, number] | null;
    timeOfGenerate: string | null;
}

const AddPoint: React.FC<AddPointProps> = ({ addButtonCancelHandler, position, timeOfGenerate }) => {
    const [inputName, setName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(true);

    const handleClose = () => {
        setOpen(false);
        addButtonCancelHandler();
    };

    const addButtonSaveHandler = async () => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        if (token) {
            setAuthToken(token);
        }

        setLoading(true);
        axiosInstance.post('/points/add_point', {
            user_id: user_id,
            name: inputName,
            coordinates: position,
            timeOfGenerate: timeOfGenerate,
        })
            .then(response => {
                setLoading(false);
                setError(null);
                handleClose();
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                setLoading(false);
                setError('Error occurred while saving the point.');
            });
    };
    console.log({
        user_id: 1,
        name: inputName,
        coordinates: position,
        timeOfGenerate: timeOfGenerate ? new Date(timeOfGenerate).toISOString() : null,
    })
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
