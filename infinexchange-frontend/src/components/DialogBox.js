import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { blue } from '@mui/material/colors';

const DialogBox = ({ open, handleClose, handleAction, icon: Icon, message, actionLabel }) => (
  <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle sx={{ backgroundColor: '#004AAD', color: 'white' }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {/* {actionLabel} */}
      </Typography>
      <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ textAlign: 'center', padding: 3 }}>
      {Icon && <Icon sx={{ fontSize: 60, color: blue[700] }} />}
      <Typography variant="h6" sx={{ marginY: 2 }}>
        {message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', padding: 2 }}>
      <Button
        onClick={handleAction}
        variant="contained"
        sx={{ backgroundColor: '#102C57', '&:hover': { backgroundColor: '#0a1d39' } }}
      >
        {actionLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogBox;
