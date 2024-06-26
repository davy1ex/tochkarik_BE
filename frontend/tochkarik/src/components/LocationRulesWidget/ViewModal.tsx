import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface ViewModalProps {
    show: boolean;
    onClose: () => void;
    rule: any;
}

const ViewModal: React.FC<ViewModalProps> = ({show, onClose, rule}) => {
    return (
        <Dialog open={show} onClose={onClose}>
            <DialogTitle>View Rule</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <p><strong>ID:</strong> {rule.id}</p>
                    <p><strong>Name:</strong> {rule.name}</p>
                    <p><strong>Rules:</strong> {rule.rules.type.join(', ')}</p>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewModal;
