// InfoDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Box, Typography } from '@mui/material';
import steps from '../Navbar/steps'; // Adjust the path if necessary

const InfoDialog = ({ open, onClose, activeStep, setActiveStep }) => {
  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep < steps.length - 1 ? prevStep + 1 : prevStep));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>User Guide: StartUp Vest</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {steps[activeStep]?.content}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
          Next
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
