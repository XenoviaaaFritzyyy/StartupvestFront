import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SuccessCreateFundingRoundDialog({ open, onClose, companyName, fundingType }) {
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(open);

    useEffect(() => {
        let timer;
        if (open) {
            setIsSuccessDialogOpen(true);
            timer = setTimeout(() => {
                setIsSuccessDialogOpen(false);
                onClose();
            }, 1500);
        }
        return () => clearTimeout(timer);
    }, [open, onClose]);

    return (
        <>
            <Dialog open={isSuccessDialogOpen} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ fontSize: 30, marginRight: 1 }} />
                    <Typography variant="h6">Funding Round Created</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        The {fundingType} funding round for <strong>{companyName}</strong> has been successfully created.
                    </Typography>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SuccessCreateFundingRoundDialog;
