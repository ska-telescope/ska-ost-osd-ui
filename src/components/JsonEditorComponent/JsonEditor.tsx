import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonVariantTypes, ButtonColorTypes } from '@ska-telescope/ska-gui-components';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddFieldDialog from '../AddFieldDialogComponent/AddFieldDialog';
import CloseIcon from '@mui/icons-material/Close';
import { isValidJson } from '../utils';
import { JsonObject } from './types';
import DynamicForm from '../DynamicFormComponent/DynamicForm';
import ApiErrorDialog from '../ApiErrorDialogComponent/ApiErrorDialog';

interface JsonEditorProps {
  initialData?: JsonObject;
  onSave: (data: JsonObject) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ initialData, onSave }) => {
  const { t } = useTranslation('translations');

  const [data, setData] = useState<JsonObject>(() => {
    return initialData ? structuredClone(initialData) : {};
  });
  const [jsonEditMode, setJsonEditMode] = useState(false);
  const [jsonEditContent, setJsonEditContent] = useState('');
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentEditPath, setCurrentEditPath] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetEditState = () => {
    setJsonEditMode(false);
    setCurrentEditPath([]);
    setJsonEditContent('');
  };

  const updateValue = (
    path: string[],
    value: string | number | boolean | string[] | Record<string, unknown>,
  ) => {
    // Use deep copy to properly handle nested structures
    const newData = structuredClone(data);
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }

    if (path.length > 0) {
      current[path[path.length - 1]] = value;
      setData(newData);
    }
  };

  const deleteValue = (path: string[]) => {
    // Deep clone to properly handle nested structures
    const newData = structuredClone(data);
    let current = newData;

    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) return;
      current = current[path[i]];
    }

    if (path.length > 0) {
      delete current[path[path.length - 1]];
      setData(newData);
    }
  };

  const addValue = (
    path: string[],
    key: string,
    value: string | number | boolean | string[] | Record<string, unknown>,
  ) => {
    // Deep clone to properly handle nested structures
    const newData = structuredClone(data);
    let current = newData;

    for (const segment of path) {
      if (!(segment in current)) {
        current[segment] = {};
      }
      current = current[segment];
    }

    current[key] = value;
    setData(newData);
  };

  const handleJsonEditOpen = (path: string[]) => {
    try {
      // Get value at path and deep clone it
      let targetValue = data;
      if (path.length > 0) {
        for (const segment of path) {
          if (!(segment in targetValue)) {
            throw new Error(`Invalid path: ${path.join('.')}`);
          }
          targetValue = targetValue[segment];
        }
      }

      // Deep clone to preserve structure
      const valueToEdit = structuredClone(targetValue);
      setJsonEditContent(JSON.stringify(valueToEdit, null, 2));
      setJsonEditMode(true);
    } catch (e) {
      setError('Failed to open editor for this field');
    }
  };

  const handleJsonEditSave = () => {
    if (!isValidJson(jsonEditContent)) {
      return;
    }

    try {
      // Parse JSON directly without any special reconstruction
      const parsedContent = JSON.parse(jsonEditContent) as JsonObject;

      const newData = structuredClone(data);

      // Set the new value while preserving array structures
      if (currentEditPath.length > 0) {
        let current = newData;
        for (let i = 0; i < currentEditPath.length - 1; i++) {
          current = current[currentEditPath[i]] as JsonObject;
        }

        // Set the value directly without any special handling
        const lastKey = currentEditPath[currentEditPath.length - 1];
        current[lastKey] = parsedContent;
      } else {
        Object.assign(newData, parsedContent);
      }

      setData(newData);
      resetEditState();
    } catch (e) {
      // Error will be handled by the surrounding error boundary
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 2 }}>
        <Button
          icon={<EditIcon />}
          ariaDescription="Button for edit"
          label={t('label.button.editChanges')}
          testId="edit-json-button"
          color={ButtonColorTypes.Secondary}
          variant={ButtonVariantTypes.Contained}
          onClick={() => {
            setCurrentEditPath([]);
            // Direct stringify to maintain array structure
            setJsonEditContent(JSON.stringify(data, null, 2));
            setJsonEditMode(true);
          }}
        />
        <Button
          ariaDescription="Button to save all changes"
          label={t('label.button.saveAllChanges')}
          variant={ButtonVariantTypes.Contained}
          color={ButtonColorTypes.Inherit}
          testId="save-json-button"
          onClick={() => {
            const formattedData = structuredClone(data);
            setPendingChanges(formattedData);
            setConfirmDialogOpen(true);
          }}
        />
      </Box>

      <DynamicForm
        data={data}
        path={[]}
        onUpdate={updateValue}
        onDelete={deleteValue}
        onAdd={(path) => {
          setCurrentPath(path);
          setAddFieldDialogOpen(true);
        }}
        onEdit={(path) => {
          setCurrentEditPath(path);
          handleJsonEditOpen(path);
        }}
      />

      <AddFieldDialog
        open={addFieldDialogOpen}
        onClose={() => setAddFieldDialogOpen(false)}
        onAdd={(key, value) => {
          addValue(currentPath, key, value);
          setAddFieldDialogOpen(false);
        }}
      />

      <Dialog
        aria-label={t('ariaLabel.dialog')}
        open={jsonEditMode}
        onClose={() => setJsonEditMode(false)}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px',
            },
          },
        }}
        fullWidth
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {t('dialog.editJson')}
          <IconButton
            aria-label="close"
            onClick={resetEditState}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={15}
            value={jsonEditContent}
            onChange={(e) => setJsonEditContent(e.target.value)}
            error={!isValidJson(jsonEditContent)}
            helperText={!isValidJson(jsonEditContent) ? t('dialog.messages.invalidJson') : ''}
            data-testid="json-edit-textarea"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={resetEditState}
            label={t('label.button.cancel')}
            testId="cancel-edit-button"
            color={ButtonColorTypes.Secondary}
          />
          <Button
            onClick={handleJsonEditSave}
            label={t('label.button.save')}
            disabled={!isValidJson(jsonEditContent)}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Inherit}
            testId="save-json-edit-button"
          />
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>{t('dialog.confirmSave')}</DialogTitle>
        <DialogContent>
          <Typography>{t('dialog.messages.confirmSave')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            label={t('label.button.cancel')}
            testId="cancel-save-button"
            color={ButtonColorTypes.Secondary}
          />
          <Button
            onClick={async () => {
              if (pendingChanges) {
                try {
                  onSave(pendingChanges);
                  setData(pendingChanges);
                  setJsonEditMode(false);
                  setConfirmDialogOpen(false);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to save changes');
                }
              } else {
                setConfirmDialogOpen(false);
              }
            }}
            label={t('label.button.ok')}
            disabled={!isValidJson(jsonEditContent)}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Inherit}
            testId="confirm-save-button"
          />
        </DialogActions>
      </Dialog>

      <ApiErrorDialog open={!!error} onClose={() => setError(null)} error={error || ''} />
    </Box>
  );
};

export default JsonEditor;