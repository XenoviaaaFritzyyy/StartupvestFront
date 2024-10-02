import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SignupDialog = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: { borderRadius: 20, padding: '20px', maxWidth: '400px', textAlign: 'center' },
            }} >
            <DialogTitle>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} >
                    <CheckCircleIcon sx={{ fontSize: 50, color: '#4caf50', marginBottom: '10px' }} />
                    <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                        Signup Successful
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Typography>You have successfully signed up! You will be redirected to the login page shortly.</Typography>
            </DialogContent>
        </Dialog>
    );
};

export default SignupDialog;