import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress, Typography } from '@mui/material';

const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (deleteSuccessDialogOpen) {
      timer = setTimeout(() => {
        setDeleteSuccessDialogOpen(false);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessDialogOpen]);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setDeleteSuccessDialogOpen(true);
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
      onClose(); 
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f44336', color: 'white', mb: 3 }}>
          <Typography variant="h6">Delete Confirmation</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this funding round? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#f44336', '&:hover': { backgroundColor: '#fce4e4' } }}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }}
            autoFocus
            disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} sx={{ color: '#4caf50' }} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={deleteSuccessDialogOpen} onClose={() => setDeleteSuccessDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#4caf50', color: 'white', mb: 3}}>
          <Typography variant="h6">Funding Round Removed</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The funding round has been successfully deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSuccessDialogOpen(false)} sx={{ color: '#4caf50', '&:hover': { backgroundColor: '#e8f5e9' } }}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDeleteDialog;
