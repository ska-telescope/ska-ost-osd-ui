import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface EditFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (value: any) => void;
  fieldKey: string;
  initialValue: any;
}

const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  open,
  onClose,
  onSave,
  fieldKey,
  initialValue,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(typeof initialValue === 'object' ? JSON.stringify(initialValue, null, 2) : String(initialValue));
  }, [initialValue]);

  const handleSave = () => {
    try {
      // Try to parse as JSON if the original value was an object/array
      const parsedValue = typeof initialValue === 'object' ? JSON.parse(value) : value;
      onSave(parsedValue);
      onClose();
    } catch (error) {
      // If parsing fails, save as a string
      onSave(value);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit {fieldKey}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFieldDialog;