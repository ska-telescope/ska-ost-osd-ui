import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';

interface DynamicFormProps {
  data: Record<string, unknown>;
  path: string[];
  onUpdate: (path: string[], value: string | number | boolean | string[] | Record<string, unknown>) => void;
  onDelete: (path: string[]) => void;
  onAdd: (path: string[], key: string, value: string | number | boolean | string[] | Record<string, unknown>) => void;
  onEdit: (path: string[], value: string | number | boolean | string[] | Record<string, unknown>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  data,
  path,
  onUpdate,
  onDelete,
  onAdd,
  onEdit
}) => {
  

  const renderField = (key: string, value: string | number | boolean | string[] | Record<string, unknown>, currentPath: string[]) => {
    if (Array.isArray(value)) {
      return (
        <Box key={key} sx={{ mb: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Array Items (comma-separated)"
                value={value.filter(item => typeof item !== 'object' || item === null).join(', ')}
                onChange={(e) => {
                  const newArray = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
                  onUpdate([...currentPath, key], newArray);
                }}
                multiline
                rows={2}
                margin="dense"
                helperText="Enter comma-separated values"
              />
              {value.map((item, index) => (
                typeof item === 'object' && item !== null ? (
                  <Box key={index} sx={{ mb: 1, pl: 2, borderLeft: '2px solid #eee' }}>
                    <DynamicForm
                      data={item}
                      path={[...currentPath, key, index.toString()]}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onAdd={onAdd}
                      onEdit={onEdit}
                    />
                    <IconButton
                      onClick={() => {
                        const newArray = value.filter((_, i) => i !== index);
                        onUpdate([...currentPath, key], newArray);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : null
              ))}
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  const newArray = [...value, ''];
                  onUpdate([...currentPath, key], newArray);
                }}
                variant="outlined"
                size="small"
              >
                Add Item
              </Button>
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <Box key={key} sx={{ mb: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }} data-testid="field-container">
                <Typography>{key}</Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    aria-label="edit"
                    data-testid="edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit([...currentPath, key], value);
                    }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    aria-label="delete"
                    data-testid="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete([...currentPath, key]);
                    }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <DynamicForm
                data={value}
                path={[...currentPath, key]}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                onEdit={onEdit}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      );
    }

    return (
      <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label={key}
          value={value}
          onChange={(e) => onUpdate([...currentPath, key], e.target.value)}
          type={typeof value === 'number' ? 'number' : 'text'}
          margin="dense"
        />
        <IconButton
          onClick={() => onDelete([...currentPath, key])}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box>
      {Object.entries(data).map(([key, value]) => renderField(key, value, path))}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          onClick={() => onAdd(path, '', '')}
          variant="contained"
          size="small"
        >
          ADD NEW FIELD
        </Button>
      </Box>
    </Box>
  );
};

export default DynamicForm;