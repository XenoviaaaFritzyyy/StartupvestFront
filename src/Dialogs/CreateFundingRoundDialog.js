import React from 'react';
import { Box, IconButton } from '@mui/material';
import CreateFundingRound from '../Form/CreateFundingRound';
import CloseIcon from '@mui/icons-material/Close';

function CreateFundingRoundDialog({ open, onClose }) {
    return (
        open && (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1300,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Box
                    sx={{
                        background: '#F2F2F2',
                        maxWidth: '100%',
                        maxHeight: '90%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        borderRadius: '8px',
                    }}>
                    <Box
                        sx={{
                            pt: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}>
                        <IconButton onClick={onClose} sx={{ color: '#007490' }}>
                            <CloseIcon sx={{ fontSize: '24px' }} />
                        </IconButton>
                    </Box>

                    {/* Form content with scrolling */}
                    <Box sx={{ pb: 5, overflowY: 'auto' }}>
                        <CreateFundingRound onSuccess={onClose} />
                    </Box>
                </Box>
            </Box>
        )
    );
}

export default CreateFundingRoundDialog;
