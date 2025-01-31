import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, value: any) => void;
}

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [fieldType, setFieldType] = useState('single');
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const handleAdd = () => {
    if (!fieldName) return;

    let value: any = fieldValue;
    
    if (fieldType === 'array') {
      try {
        value = fieldValue ? fieldValue.split(',').map(item => item.trim()) : [];
      } catch (e) {
        value = [];
      }
    } else if (fieldType === 'object') {
      try {
        value = JSON.parse(fieldValue || '{}');
      } catch (e) {
        value = {};
      }
    }

    onAdd(fieldName, value);
    handleClose();
  };

  const handleClose = () => {
    setFieldName('');
    setFieldValue('');
    setFieldType('single');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add New Field
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Field Name"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={fieldType}
              label="Field Type"
              onChange={(e) => setFieldType(e.target.value)}
            >
              <MenuItem value="single">Single Value</MenuItem>
              <MenuItem value="array">Array</MenuItem>
              <MenuItem value="object">Object</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline={fieldType !== 'single'}
            rows={fieldType !== 'single' ? 4 : 1}
            label={
              fieldType === 'array'
                ? 'Values (comma-separated)'
                : fieldType === 'object'
                ? 'JSON Object'
                : 'Value'
            }
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            helperText={
              fieldType === 'array'
                ? 'Enter comma-separated values'
                : fieldType === 'object'
                ? 'Enter valid JSON object'
                : ''
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary" disabled={!fieldName}>
          Add Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFieldDialog;