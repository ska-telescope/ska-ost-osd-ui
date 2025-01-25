import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import mockData from '../../utils/mock_data.json';

interface JsonEditorProps {
  onSave: (data: any) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ onSave }) => {
  const [data, setData] = useState({
    telescope: mockData.capabilities.mid.telescope,
    basic_capabilities: mockData.capabilities.mid.basic_capabilities,
    ...Object.fromEntries(Object.entries(mockData.capabilities.mid).filter(([key]) => key.startsWith('AA'))),
    observatory_policy: mockData.observatory_policy
  });
  const [jsonView, setJsonView] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [valueType, setValueType] = useState('string');

  // Handle telescope selection change
  const handleTelescopeChange = (value: string) => {
    setData({ ...data, telescope: value });
  };

  // Handle basic capabilities changes
  const handleBasicCapabilityChange = (field: string, value: any) => {
    setData({
      ...data,
      basic_capabilities: {
        ...data.basic_capabilities,
        [field]: value
      }
    });
  };

  // Add new receiver to basic capabilities
  const addReceiver = () => {
    const newReceiver = {
      rx_id: `Band_${data.basic_capabilities.receiver_information.length + 1}`,
      min_frequency_hz: 0,
      max_frequency_hz: 0
    };
    
    const updatedReceivers = [...data.basic_capabilities.receiver_information, newReceiver];
    handleBasicCapabilityChange('receiver_information', updatedReceivers);
  };

  // Handle array assembly changes
  const handleArrayAssemblyChange = (assembly: string, field: string, value: any) => {
    setData({
      ...data,
      [assembly]: {
        ...data[assembly],
        [field]: value
      }
    });
  };

  // Handle custom field addition
  const handleAddCustomField = () => {
    let parsedValue = newValue;
    if (valueType === 'number') {
      parsedValue = parseFloat(newValue);
    } else if (valueType === 'array') {
      try {
        parsedValue = JSON.parse(newValue);
      } catch (e) {
        parsedValue = newValue.split(',').map(item => item.trim());
      }
    }

    if (currentSection === 'basic_capabilities') {
      handleBasicCapabilityChange(newKey, parsedValue);
    } else if (currentSection.startsWith('AA')) {
      handleArrayAssemblyChange(currentSection, newKey, parsedValue);
    }

    setOpenDialog(false);
    setNewKey('');
    setNewValue('');
    setValueType('string');
  };

  // Open dialog for adding custom field
  const openAddFieldDialog = (section: string) => {
    setCurrentSection(section);
    setOpenDialog(true);
  };

  // Add new array assembly
  const addArrayAssembly = () => {
    const newAssemblyName = `AA${Object.keys(data).length}`;
    setData({
      ...data,
      [newAssemblyName]: {
        available_receivers: [],
        number_ska_dishes: 0,
        number_meerkat_dishes: 0,
        number_meerkatplus_dishes: 0,
        max_baseline_km: 0,
        available_bandwidth_hz: 0,
        number_channels: 0,
        cbf_modes: [],
        number_zoom_windows: 0,
        number_zoom_channels: 0,
        number_pss_beams: 0,
        number_pst_beams: 0,
        ps_beam_bandwidth_hz: 0,
        number_fsps: 0,
      }
    });
  };

  // Update JSON view
  const updateJsonView = () => {
    setJsonView(JSON.stringify(data, null, 2));
  };

  // Handle save
  const handleSave = () => {
    const updatedMockData = {
      ...mockData,
      capabilities: {
        ...mockData.capabilities,
        mid: {
          ...Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'observatory_policy')),
        }
      },
      observatory_policy: data.observatory_policy
    };
    onSave(updatedMockData);
    updateJsonView();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        JSON Editor
      </Typography>

      {/* Telescope Section */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Telescope Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Telescope"
            value={data.telescope}
            onChange={(e) => handleTelescopeChange(e.target.value)}
            margin="normal"
          />
        </AccordionDetails>
      </Accordion>

      {/* Basic Capabilities Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Basic Capabilities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => openAddFieldDialog('basic_capabilities')}
              variant="outlined"
              size="small"
              sx={{ color: 'red' }}
            >
              Add Custom Field
            </Button>
          </Box>
          {Object.entries(data.basic_capabilities).map(([key, value]) => {
            if (key === 'receiver_information') {
              return (
                <Box key={key}>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>Receiver Information</Typography>
                  {value.map((receiver: any, index: number) => (
                    <Box key={index} sx={{ mt: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                      {Object.entries(receiver).map(([rxKey, rxValue]) => (
                        <TextField
                          key={rxKey}
                          fullWidth
                          label={rxKey.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          type={typeof rxValue === 'number' ? 'number' : 'text'}
                          value={rxValue}
                          onChange={(e) => {
                            const updatedReceivers = [...value];
                            updatedReceivers[index] = {
                              ...updatedReceivers[index],
                              [rxKey]: typeof rxValue === 'number' ? parseFloat(e.target.value) : e.target.value
                            };
                            handleBasicCapabilityChange('receiver_information', updatedReceivers);
                          }}
                          margin="dense"
                        />
                      ))}
                      <IconButton 
                        onClick={() => {
                          const updatedReceivers = value.filter((_: any, i: number) => i !== index);
                          handleBasicCapabilityChange('receiver_information', updatedReceivers);
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addReceiver}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    Add Receiver
                  </Button>
                </Box>
              );
            }
            return (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  type={typeof value === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => handleBasicCapabilityChange(key, typeof value === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  margin="normal"
                />
                <IconButton 
                  onClick={() => {
                    const { [key]: removed, ...rest } = data.basic_capabilities;
                    setData({
                      ...data,
                      basic_capabilities: rest
                    });
                  }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>

      {/* Array Assemblies Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Array Assemblies</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {Object.keys(data).filter(key => key.startsWith('AA')).map((assembly) => (
            <Accordion key={assembly} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{assembly}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => openAddFieldDialog(assembly)}
                    variant="outlined"
                    size="small"
                  >
                    Add Custom Field
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(data[assembly]).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return (
                        <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField
                            fullWidth
                            label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            value={value.join(', ')}
                            onChange={(e) => handleArrayAssemblyChange(assembly, key, e.target.value.split(', '))}
                            margin="dense"
                          />
                          <IconButton 
                            onClick={() => {
                              const { [key]: removed, ...rest } = data[assembly];
                              setData({
                                ...data,
                                [assembly]: rest
                              });
                            }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      );
                    }
                    return (
                      <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          type={typeof value === 'number' ? 'number' : 'text'}
                          value={value}
                          onChange={(e) => handleArrayAssemblyChange(assembly, key, 
                            typeof value === 'number' ? parseFloat(e.target.value) : e.target.value)}
                          margin="dense"
                        />
                        <IconButton 
                          onClick={() => {
                            const { [key]: removed, ...rest } = data[assembly];
                            setData({
                              ...data,
                              [assembly]: rest
                            });
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addArrayAssembly}
            variant="outlined"
            sx={{ mt: 1 }}
          >
            Add Array Assembly
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Observatory Policy Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Observatory Policy</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => openAddFieldDialog('observatory_policy')}
              variant="outlined"
              size="small"
            >
              Add Custom Field
            </Button>
          </Box>
          {Object.entries(data.observatory_policy).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {Array.isArray(value) ? (
                <TextField
                  fullWidth
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={value.join(', ')}
                  onChange={(e) => {
                    const updatedPolicy = {
                      ...data.observatory_policy,
                      [key]: e.target.value.split(', ')
                    };
                    setData({
                      ...data,
                      observatory_policy: updatedPolicy
                    });
                  }}
                  margin="dense"
                />
              ) : typeof value === 'object' && value !== null ? (
                <TextField
                  fullWidth
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  value={JSON.stringify(value)}
                  onChange={(e) => {
                    try {
                      const parsedValue = JSON.parse(e.target.value);
                      const updatedPolicy = {
                        ...data.observatory_policy,
                        [key]: parsedValue
                      };
                      setData({
                        ...data,
                        observatory_policy: updatedPolicy
                      });
                    } catch (err) {
                      console.error('Invalid JSON:', err);
                    }
                  }}
                  margin="dense"
                />
              ) : (
                <TextField
                  fullWidth
                  label={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  type={typeof value === 'number' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => {
                    const updatedPolicy = {
                      ...data.observatory_policy,
                      [key]: typeof value === 'number' ? parseFloat(e.target.value) : e.target.value
                    };
                    setData({
                      ...data,
                      observatory_policy: updatedPolicy
                    });
                  }}
                  margin="dense"
                />
              )}
              <IconButton 
                onClick={() => {
                  const { [key]: removed, ...rest } = data.observatory_policy;
                  setData({
                    ...data,
                    observatory_policy: rest
                  });
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* JSON View Section */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">JSON View</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={jsonView}
            InputProps={{
              readOnly: true,
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>

      {/* Dialog for adding custom fields */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Custom Field</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Field Name"
            fullWidth
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Field Value"
            fullWidth
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Value Type"
            fullWidth
            value={valueType}
            onChange={(e) => setValueType(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="array">Array</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: 'red' }}>Cancel</Button>
          <Button onClick={handleAddCustomField}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JsonEditor;