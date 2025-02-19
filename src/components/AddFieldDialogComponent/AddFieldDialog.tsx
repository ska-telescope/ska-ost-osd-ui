import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  TextEntry,
  LABEL_POSITION,
  DropDown,
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  ButtonSizeTypes
} from '@ska-telescope/ska-gui-components';

interface AddFieldDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (key: string, value: string | string[] | Record<string, unknown>) => void;
}

interface fieldTypeOptionsType {
  label: string;
  value: string;
}

export const fieldTypeOptions: fieldTypeOptionsType[] = [
  { label: 'Number', value: 'number' },
  { label: 'String', value: 'string' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Array', value: 'array' },
  { label: 'Object', value: 'object' }
];

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({ open, onClose, onAdd }) => {
  const [fieldType, setFieldType] = useState('number');
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const { t } = useTranslation('translations');
  const [isDisabled, setIsDisabled] = useState(true);

  const handleValue = (e) => {
    typeof e === 'number' ? setFieldValue(+e) : setFieldValue(e);

    setIsDisabled(false);
  };

  const handleAdd = () => {
    if (!fieldName.trim()) return;

    let value: string | string[] | Record<string, unknown> = fieldValue;

    if (fieldType === 'array') {
      try {
        value = fieldValue ? fieldValue.split(',').map((item) => item.trim()) : [];
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
    setFieldType('number');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('dialog.addNewField')}
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
          <TextEntry
            label={t('dialog.fields.fieldName')}
            labelPosition={LABEL_POSITION.CONTAINED}
            testId="field-name-input"
            value={fieldName}
            setValue={(e) => setFieldName(e)}
          />
          <DropDown
            options={fieldTypeOptions}
            testId="field-type-select"
            value={fieldType}
            setValue={(e) => setFieldType(e)}
            label={t('dialog.fields.fieldType')}
            labelBold
          />
          <TextEntry
            label={
              fieldType === 'array'
                ? t('dialog.fields.values')
                : fieldType === 'object'
                  ? t('dialog.fields.jsonObject')
                  : t('dialog.fields.value')
            }
            labelPosition={LABEL_POSITION.CONTAINED}
            testId="field-value-input"
            value={fieldValue}
            setValue={(e) => handleValue(e)}
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
        <Button
          ariaDescription="Button to cancel"
          label={t('label.button.cancel')}
          onClick={handleClose}
          testId="cancel-button"
          size={ButtonSizeTypes.Small}
          color={ButtonColorTypes.Inherit}
          variant={ButtonVariantTypes.Contained}
        />
        <Button
          ariaDescription="Button to add"
          label={t('label.button.addField')}
          onClick={handleAdd}
          disabled={isDisabled}
          testId="add-field-button"
          size={ButtonSizeTypes.Small}
          color={ButtonColorTypes.Secondary}
          variant={ButtonVariantTypes.Contained}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddFieldDialog;
