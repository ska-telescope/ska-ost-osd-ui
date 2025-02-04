import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, value: string | string[] | Record<string, unknown>) => void;
}

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({
  open,
  onClose,
  onAdd
}) => {
  const [fieldType, setFieldType] = useState('single');
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const { t } = useTranslation();

  const handleAdd = () => {
    if (!fieldName.trim()) return;

    let value: string | string[] | Record<string, unknown> = fieldValue;
    
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
        {t('dialog.titles.addNewField')}
        <IconButton
          aria-label={t('label.button.close')}
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          data-testid="close-icon-button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label={t('dialog.fields.fieldName')}
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            data-testid="field-name-input"
          />
          <FormControl fullWidth>
            <InputLabel>{t('dialog.fields.fieldType')}</InputLabel>
            <Select
              value={fieldType}
              label={t('dialog.fields.fieldType')}
              onChange={(e) => setFieldType(e.target.value)}
              data-testid="field-type-select"
            >
              <MenuItem value="single">{t('dialog.types.singleValue')}</MenuItem>
              <MenuItem value="array">{t('dialog.types.array')}</MenuItem>
              <MenuItem value="object">{t('dialog.types.object')}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline={fieldType !== 'single'}
            rows={fieldType !== 'single' ? 4 : 1}
            label={
              fieldType === 'array'
                ? t('dialog.fields.values')
                : fieldType === 'object'
                ? t('dialog.fields.jsonObject')
                : t('dialog.fields.value')
            }
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            data-testid="field-value-input"
            helperText={
              fieldType === 'array'
                ? t('dialog.help.array')
                : fieldType === 'object'
                ? t('dialog.help.object')
                : ''
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" data-testid="cancel-button">
          {t('label.button.cancel')}
        </Button>
        <Button onClick={handleAdd} color="primary" disabled={!fieldName.trim()} data-testid="add-field-button">
          {t('label.button.addField')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFieldDialog;