/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField
} from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DataGrid
} from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SLTLogMockList from '../../mockData/SLTLogMock';
import apiService from '../../services/apis';

const COLUMN_WIDTH = 300;

const ViewEB = ({ ebId }) => {
  const { t } = useTranslation('translations');

  const [openModal, setOpenModal] = useState(false);

  const handleCloseRequestResponse = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const RequestResponseDisplay = ({ responseArray }) => (
    <div>
      {responseArray.map((data) => (
        <>
          <p>
            <b>Command Name:</b> {data.request}
          </p>
          <p>
            <b>Status:</b> {data.status}
          </p>
          <p>
            <b>Request Sent at:</b> {data.request_sent_at}
          </p>
          <p>
            <b>Details:</b> {data.status == 'OK' ? data.response.result : data.error.detail}
          </p>
          <hr />
        </>
      ))}
    </div>
  );

  return (
    <>
      {' '}
      <span
        id="shiftId"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => handleOpen()}
      >
        {ebId.eb_id}
      </span>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogStatus"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px' // Set your width here
            }
          }
        }}
        open={openModal}
        onClose={handleCloseRequestResponse}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>EB Request Response</DialogTitle>
        <DialogContent dividers>
          <RequestResponseDisplay responseArray={ebId.request_responses} />
        </DialogContent>
        <DialogActions>
          <Button
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="statusClose"
            label={t('label.close')}
            onClick={handleCloseRequestResponse}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

const ShiftDataTest = (data) => {
  const { t } = useTranslation('translations');
  const [openModal, setOpenModal] = useState(false);
  const [images, setImages] = useState([]);
  const [value, setValue] = useState(data.data.annotations);

  const ImageDisplay = () => (
    <div>
      {images &&
        images.length > 0 &&
        images.map((image, index) => (
          <>
            <img
              key={index}
              src={`data:image/jpg;base64,${image}`}
              width={700}
              height={500}
              alt={`Image ${index}`}
            />
            <hr />
          </>
        ))}
    </div>
  );

  const fetchImage = async () => {
    const path = `shifts/images/${data.data.id}`;
    const result = await apiService.getImage(path);
    setImages(result.data.data);
  };

  const getAnnotation = async () => {
    const shiftData = {
      annotations: `${value}, `
    };

    const path = `shifts/${data.data.id}`;
    const response = await apiService.putShiftData(path, shiftData);
    setValue(response.data.data.annotations);
  };

  let id = 1;
  SLTLogMockList.map((row) => {
    row.id = id++;
    return row;
  });

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    fetchImage();

    setOpenModal(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const columns = [
    {
      field: 'source',
      headerName: t('label.source'),
      width: COLUMN_WIDTH,
      renderCell: (params) => params.row.shift_operator
    },
    {
      field: 'info.eb_id',
      headerName: t('label.info'),
      width: COLUMN_WIDTH,

      renderCell: (params) => <ViewEB ebId={params.row.info} />
    },
    {
      field: 'info.sbi_status',
      headerName: t('label.currentStatus'),
      width: COLUMN_WIDTH,

      renderCell: (params) => params.row.info.sbi_status
    },
    {
      field: 'log_time',
      headerName: t('label.logTime'),
      width: COLUMN_WIDTH,
      renderCell: (params) => params.row.info.log_time
    }
  ];

  return (
    <Box data-testid="availableData" m={1}>
      <Grid container spacing={2} sx={{ paddingLeft: 2 }} alignItems="left" textAlign="left">
        <Grid item xs={12} sm={12} md={4}>
          <p style={{ fontWeight: 'bold' }}>Shift ID: {data.data.shift_id}</p>
        </Grid>
        <Grid item xs={12} sm={12} md={3} />
        <Grid item xs={12} sm={12} md={5}>
          <p style={{ fontWeight: 'bold' }}>Shift Start: {data.data.shift_start} </p>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ paddingLeft: 2 }} alignItems="left" textAlign="left">
        <Grid item xs={12} sm={12} md={4}>
          <p style={{ fontWeight: 'bold', alignItems: 'center' }}>
            Operator Name: {data.data.shift_operator.name}{' '}
          </p>
        </Grid>
        <Grid item xs={12} sm={12} md={3} />
        <Grid item xs={12} sm={12} md={3}>
          <p style={{ fontWeight: 'bold', alignItems: 'center' }}>
            Shift End: {data.data.shift_end}{' '}
          </p>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <p style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleOpen}>
            View Images
          </p>

          <Dialog
            aria-label={t('ariaLabel.dialog')}
            data-testid="dialogStatus"
            sx={{
              '& .MuiDialog-container': {
                '& .MuiPaper-root': {
                  width: '100%',
                  maxWidth: '1000px' // Set your width here
                }
              }
            }}
            open={openModal}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle>View Images</DialogTitle>
            <DialogContent dividers>
              <ImageDisplay />
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{ paddingLeft: 2, paddingTop: 2 }}
        alignItems="left"
        textAlign="left"
      >
        <Grid item xs={12} sm={12} md={5}>
          <TextField
            sx={{ width: 700, alignContent: 'flex-end' }}
            id="outlined-multiline-static"
            label="Annotations"
            multiline
            rows={3}
            value={value}
            onChange={handleChange}
          />
        </Grid>
        <Grid item sx={{ mt: 7, ml: -6 }} xs={12} sm={12} md={1}>
          <Button
            icon={<AddIcon />}
            ariaDescription="Button for submitting comment"
            label={t('label.submit')}
            testId="commentButton"
            onClick={getAnnotation}
            variant={ButtonVariantTypes.Contained}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={1} />

        <Grid item xs={12} sm={12} md={5}>
          <TextField
            sx={{ width: 700, alignContent: 'flex-end' }}
            id="outlined-multiline-static"
            label="Operator Comments"
            multiline
            rows={3}
            inputProps={{
              readOnly: true
            }}
            value={data.data.comments}
          />
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ border: 1, marginTop: 1 }}>
        <Grid container spacing={2} alignItems="left" textAlign="center">
          <Grid item xs={12} sm={12} md={12}>
            <Paper elevation={2} sx={{ border: 1, margin: 1 }}>
              <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
                Logs for Shift ID {data.data.shift_id}
              </p>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <DataGrid
              ariaDescription={t('ariaLabel.gridTableDescription')}
              ariaTitle={t('ariaLabel.gridTable')}
              data-testid={data}
              columns={columns}
              rows={SLTLogMockList}
              showBorder
              testId="sltLogTable"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ShiftDataTest;
