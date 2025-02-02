import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import AddFieldDialog from './AddFieldDialog';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { isValidJson, formatJson } from './utils';
import DynamicForm from './DynamicForm';
import ApiErrorDialog from './ApiErrorDialog';

interface JsonEditorProps {
  cycleId?: number;
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ cycleId, initialData, onSave }) => {
  const [data, setData] = useState<Record<string, unknown>>(initialData || {});
  const [jsonEditMode, setJsonEditMode] = useState(false);
  const [jsonEditContent, setJsonEditContent] = useState('');
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateValue = (path: string[], value: string | number | boolean | string[] | Record<string, unknown>) => {
    const newData = { ...data };
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
    const newData = { ...data };
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

  const addValue = (path: string[], key: string, value: string | number | boolean | string[] | Record<string, unknown>) => {
    const newData = { ...data };
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
    let editData = data;
    for (const segment of path) {
      editData = editData[segment];
    }
    setJsonEditContent(formatJson(editData));
    setJsonEditMode(true);
  };

  const handleJsonEditSave = () => {
    try {
      const parsedContent = JSON.parse(jsonEditContent);
      setPendingChanges(parsedContent);
      setConfirmDialogOpen(true);
    } catch (e) {
      // Error will be handled by the surrounding error boundary
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => handleJsonEditOpen([])}
          startIcon={<EditIcon />}
        >
          Edit Full JSON
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const formattedData = JSON.parse(JSON.stringify(data));
            setJsonEditContent(formatJson(formattedData));
            setJsonEditMode(true);
          }}
        >
          View All Changes
        </Button>
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
        onEdit={(path) => handleJsonEditOpen(path)}
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
        open={jsonEditMode}
        onClose={() => setJsonEditMode(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit JSON
          <IconButton
            aria-label="close"
            onClick={() => setJsonEditMode(false)}
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
            helperText={!isValidJson(jsonEditContent) ? 'Invalid JSON format' : ''}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJsonEditMode(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleJsonEditSave}
            disabled={!isValidJson(jsonEditContent)}
            color="secondary"
          >
            Save Changes
          </Button>
          </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Save Changes</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (pendingChanges && cycleId) {
                try {
                  await onSave(pendingChanges);
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
            color="primary"
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <ApiErrorDialog
        open={!!error}
        onClose={() => setError(null)}
        error={error || ''}
      />
    </Box>
  );
};

export default JsonEditor;