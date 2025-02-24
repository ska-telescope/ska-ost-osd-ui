import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ButtonVariantTypes,
  ButtonColorTypes,
  InfoCard,
  InfoCardColorTypes,
  InfoCardVariantTypes,
  TextEntry,
  LABEL_POSITION
} from '@ska-telescope/ska-gui-components';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import AddFieldDialog from '../AddFieldDialogComponent/AddFieldDialog';
import CloseIcon from '@mui/icons-material/Close';
import { isValidJson } from '../utils';
import { JsonObject } from './types';
import DynamicForm from '../DynamicFormComponent/DynamicForm';
import ApiErrorDialog from '../ApiErrorDialogComponent/ApiErrorDialog';
import { useNavigate } from 'react-router-dom';

interface JsonEditorProps {
  initialData?: JsonObject;
  onSave: (data: JsonObject) => void;
  onRelease: () => void;
  cycleData: string | number;
  setRoute: () => void;
  versionData: string | null;
  isSuccess: boolean;
}

//  TODO post discussion
interface releaseOptionsType {
  label: string;
  value: string;
}

export const releaseTypeOptions: releaseOptionsType[] = [
  { label: 'Default', value: 'default' },
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' }
];

const JsonEditor: React.FC<JsonEditorProps> = ({
  initialData,
  onSave,
  onRelease,
  cycleData,
  setRoute,
  versionData,
  isSuccess
}) => {
  const navigate = useNavigate();
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
  const [isRelease, setIsRelease] = useState(false);
  const [successMessage, setMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);

  const resetEditState = () => {
    setJsonEditMode(false);
    setCurrentEditPath([]);
    setJsonEditContent('');
  };

  const updateValue = (
    path: string[],
    value: string | number | boolean | string[] | Record<string, unknown>
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
    value: string | number | boolean | string[] | Record<string, unknown>
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

  const handleSave = () => {
    try {
      if (isRelease) {
        onRelease();
        setMessage('msg.preRelease');
        setConfirmDialogOpen(false);
        setDisplayMessageElement(true);
      } else {
        if (pendingChanges) {
          onSave(pendingChanges);
          setData(pendingChanges);
          setJsonEditMode(false);
          setConfirmDialogOpen(false);
        } else {
          setConfirmDialogOpen(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };
  const handleRoute = () => {
    setRoute(true);
    navigate(`/`, { replace: true });
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(successMessage, { version: versionData })}
      testId="successStatusMsg"
      variant={InfoCardVariantTypes.Outlined}
    />
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 2 }}>
        <Button
          icon={<HomeIcon />}
          ariaDescription="Button to select cycle"
          label={t('label.button.selectCycle')}
          variant={ButtonVariantTypes.Contained}
          color={ButtonColorTypes.Secondary}
          testId="selec-cycle-button"
          onClick={handleRoute}
        />
      </Box>
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
            setIsRelease(false);
            setConfirmDialogOpen(true);
          }}
        />
        <Button
          ariaDescription="Button to select release version"
          label={t('label.button.release')}
          variant={ButtonVariantTypes.Contained}
          color={ButtonColorTypes.Inherit}
          testId="release-json-button"
          onClick={() => {
            setIsRelease(true);
            setConfirmDialogOpen(true);
          }}
        />
        <Box
          sx={{
            '& .css-16bevx5-MuiFormControl-root-MuiTextField-root': {
              marginTop: 0
            },
            width: 125
          }}
        >
          <TextEntry
            label={t('label.selectedCycle')}
            labelPosition={LABEL_POSITION.CONTAINED}
            testId="field-name-input"
            value={cycleData === '' ? 'Default' : `Cycle_${cycleData}`}
            disabled={true}
          />
        </Box>

        <Grid item xs={12} sm={12} md={2} />
        <Grid item xs={12} sm={12} md={4}>
          <div style={{ position: 'absolute', zIndex: 2 }}>
            {displayMessageElement && !isSuccess ? renderMessageResponse() : ''}
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={1} />
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
              maxWidth: '1000px'
            }
          }
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
        <DialogTitle>
          {isRelease ? t('dialog.confirmRelease') : t('dialog.confirmSave')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Typography>
              {isRelease ? t('dialog.messages.confirmRelease') : t('dialog.messages.confirmSave')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialogOpen(false)}
            label={t('label.button.cancel')}
            testId="cancel-save-button"
            color={ButtonColorTypes.Secondary}
          />
          <Button
            onClick={handleSave}
            label={t('label.button.ok')}
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
