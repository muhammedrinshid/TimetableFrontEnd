import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, DeleteForever as DeleteIcon } from '@mui/icons-material';

const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '16px',
          maxWidth: '400px',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Confirm Deletion
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" mb={3}>
          <Box
            sx={{
              bgcolor: 'error.light',
              borderRadius: '50%',
              p: 2,
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                },
              },
            }}
          >
            <DeleteIcon color="error" sx={{ fontSize: 48 }} />
          </Box>
        </Box>
        <DialogContentText id="alert-dialog-description" align="center">
          <Typography variant="body1" gutterBottom>
            Are you absolutely sure you want to delete these records?
          </Typography>
          <Typography variant="body2" color="error" fontWeight="medium">
            This action cannot be undone.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: '120px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
          sx={{ minWidth: '120px' }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationPopup;