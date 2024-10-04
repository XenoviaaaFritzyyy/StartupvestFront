import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, Box, Tooltip, IconButton, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const InvestNowDialog = ({
  open,
  onClose,
  pricePerShare = 10000,
  companyName = 'Chaching',
  fundingRound = 'Pre-seed',
}) => {
  const [shareAmount, setShareAmount] = useState('');
  const [title, setTitle] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTotalCost(shareAmount * pricePerShare || 0);
  }, [shareAmount, pricePerShare]);

  // Clear state when dialog closes
  const handleClose = () => {
    setShareAmount('');
    setTitle('');
    setErrors({});
    onClose();
  };

  const handleShareAmountChange = (e) => {
    const shares = e.target.value;
    if (shares < 1) {
      setErrors((prev) => ({ ...prev, shareAmount: 'Please enter a valid number.' }));
    } else {
      setErrors((prev) => ({ ...prev, shareAmount: '' }));
    }
    setShareAmount(shares);
  };

  const handleTitleChange = (e) => {
    const inputTitle = e.target.value;
    if (inputTitle.trim() === '') {
      setErrors((prev) => ({ ...prev, title: 'Title is required.' }));
    } else {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
    setTitle(inputTitle);
  };

  const handleConfirm = () => {
    if (!title.trim()) {
      setErrors((prev) => ({ ...prev, title: 'Title is required.' }));
      return;
    }
    if (shareAmount <= 0) {
      setErrors((prev) => ({ ...prev, shareAmount: 'Please enter a valid number.' }));
      return;
    }

    console.log('Investing:', { title, shareAmount, totalCost });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Invest in {companyName}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 15 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          {/* Investment Information */}
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom align="center">
              You are about to invest in the <strong>{fundingRound}</strong> funding round conducted by{' '}
              <strong>{companyName}</strong>. The price per share is{' '}
              <strong>P{pricePerShare.toLocaleString()}</strong>.
            </Typography>
          </Grid>

          {/* Title Input */}
          <Grid item xs={12} sm={7}>
            <Typography><strong>Title</strong></Typography>
            <Tooltip title="Enter your title (e.g., President, CEO)" arrow="top">
              <TextField
                autoFocus
                margin="dense"
                id="title"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="e.g., President"
                value={title}
                onChange={handleTitleChange}
                error={!!errors.title}
                helperText={errors.title}/>
            </Tooltip>
          </Grid>

          {/* Shares Input */}
          <Grid item xs={12} sm={5}>
            <Typography><strong>Shares</strong></Typography>
            <TextField
              margin="dense"
              id="share"
              type="number"
              fullWidth
              variant="outlined"
              placeholder="e.g., 2"
              value={shareAmount}
              onChange={handleShareAmountChange}
              helperText={errors.shareAmount}
              InputProps={{
                inputProps: { min: 1 },
              }}
              error={!!errors.shareAmount}/>
          </Grid>

          {/* Investment Summary */}
          <Grid item xs={12}>
            <Box mt={2} p={3} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Investment Summary
              </Typography>
              <Typography variant="body2" gutterBottom>
                You are buying <strong>{shareAmount || 0} shares</strong> at a price of{' '}
                <strong>P{pricePerShare.toLocaleString()}</strong> per share.
              </Typography>
              <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                Total cost: P{totalCost.toLocaleString()}
              </Typography>
            </Box>
          </Grid>

          {/* Disclaimer */}
          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
              * By confirming this investment, you agree to the terms and conditions of the funding round. Please note
              that investments are subject to risk, and you should only invest what you can afford to lose.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          sx={{ px: 4, }}
          disabled={!shareAmount || shareAmount <= 0 || !title.trim()}>
          Confirm Investment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InvestNowDialog;
