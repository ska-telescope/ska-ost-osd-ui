import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

interface ApiErrorDialogProps {
  open: boolean;
  onClose: () => void;
  error: string;
}

const ApiErrorDialog: React.FC<ApiErrorDialogProps> = ({ open, onClose, error }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Error Saving Changes</DialogTitle>
      <DialogContent>
        <Typography color="error">{error}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" data-testid="error-dialog-close-button">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiErrorDialog;
