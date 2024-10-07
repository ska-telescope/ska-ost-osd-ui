import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DataGrid,
  InfoCard,
  InfoCardColorTypes,
  TextEntry
} from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import apiService from '../../services/apis';
import ImageDisplay from '../SLTLogs/ImageDisplay';
import EBRequestResponseHistory from './EBRequestResponseHistory';

const COLUMN_WIDTH = 300;

const ShiftDataTest = ({ data }) => {
  const { t } = useTranslation('translations');
  const [openModal, setOpenModal] = useState(false);
  const [images, setImages] = useState([]);
  const [value, setValue] = useState(data && data && data.annotations);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showElement, setShowElement] = useState(false);
  const fetchImage = async () => {
    const path = `shift/shifts/download-image/${data.shift_id}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data[0]);
  };
  const addAnnotation = async () => {
    const shiftData = {
      shift_id: data.shift_id,
      annotations: `${value}`
    };

    const path = `shift/shifts/update`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setValue(response.data[0].annotations);
      setShowElement(true);
      setStatusMessage('msg.annotationSubmit');
      setTimeout(() => {
        setShowElement(false);
      }, 3000);
    }
  };

  let id = 1;
  if (data && data.shift_logs && data.shift_logs.logs) {
    data.shift_logs.logs.map((row) => {
      row.id = id++;
      return row;
    });
  }

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    fetchImage();

    setOpenModal(true);
  };

  const setAnnotationValue = (event) => {
    setValue(event);
  };

  const renderMessageResponse = () => (
    <div style={{ position: 'relative', top: '-28px' }}>
      <InfoCard
        fontSize={15}
        color={InfoCardColorTypes.Success}
        message={t(statusMessage)}
        testId="successStatusMsg"
      />
    </div>
  );
  const columns = [
    {
      field: 'source',
      headerName: t('label.source'),
      width: 120,
      renderCell: (params) => params.row.shift_operator
    },
    {
      field: 'info',
      headerName: t('label.info'),
      width: COLUMN_WIDTH,

      renderCell: (params) => <EBRequestResponseHistory ebData={params.row.info} />
    },
    {
      field: 'currentStatus',
      headerName: t('label.currentStatus'),
      width: 150,

      renderCell: (params) => params.row.info.sbi_status
    },
    {
      field: 'logTime',
      headerName: t('label.logTime'),
      width: COLUMN_WIDTH,
      renderCell: (params) => params.row.log_time
    }
  ];

  return (
    <Box sx={{ margin: 4 }}>
      <Grid container spacing={2} sx={{ paddingLeft: 0 }} justifyContent="left">
        <Grid item xs={12} sm={12} md={3}>
          <span id="shiftIDlable" style={{ fontWeight: 'bold' }}>
            {t('label.shiftIDlable')}: {`${data && data.shift_id}`}{' '}
          </span>
        </Grid>
        <Grid item xs={12} sm={12} md={3.9}>
          {showElement ? renderMessageResponse() : ''}
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          <span id="shiftStart" style={{ fontWeight: 'bold' }}>
            {t('label.shiftStart')}: {moment(data.shift_start).utc().format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ padding: 2, paddingLeft: 0 }} justifyContent="left">
        <Grid item xs={12} sm={12} md={4}>
          <span id="operatorName" style={{ fontWeight: 'bold', alignItems: 'center' }}>
            {t('label.operatorName')} : {data.shift_operator}
          </span>
        </Grid>
        <Grid item xs={12} sm={12} md={3} />
        <Grid item xs={12} sm={12} md={3}>
          <span id="shiftEnd" style={{ fontWeight: 'bold', alignItems: 'center' }}>
            {t('label.shiftEnd')}:{' '}
            {data.shift_end ? moment(data.shift_end).utc().format('YYYY-MM-DD HH:mm:ss') : ''}
          </span>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <span
            aria-hidden="true"
            id="viewImages"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onKeyDown={handleOpen}
            onClick={handleOpen}
          >
            {t('label.viewImages')}
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
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle>View Images</DialogTitle>
            <DialogContent dividers>
              {images && images.length > 0 && <ImageDisplay images={images} />}
            </DialogContent>
            <DialogActions>
              <Button
                color={ButtonColorTypes.Inherit}
                variant={ButtonVariantTypes.Contained}
                testId="statusClose"
                label={t('label.close')}
                onClick={handleClose}
                toolTip={t('label.close')}
              />
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      <Grid container sx={{ padding: 2, paddingLeft: 0 }} spacing={2}>
        <Grid item xs={12} sm={12} md={5}>
          <TextEntry
            setValue={setAnnotationValue}
            rows={2}
            label="Please enter annotation..."
            value={value}
            testId="annotation"
          />
        </Grid>
        <Grid item sx={{ mt: 7 }} xs={12} sm={12} md={1}>
          <Button
            icon={<AddIcon />}
            ariaDescription="Button for submitting comment"
            label={t('label.submit')}
            testId="commentButton"
            onClick={addAnnotation}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Secondary}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={1} />

        <Grid item xs={12} sm={12} md={5}>
          <span id="comments" style={{ fontWeight: 'bold', alignItems: 'center' }}>
            Comment:
          </span>
          <span style={{ alignItems: 'center' }}>{data.comments}</span>
        </Grid>
      </Grid>

      <Paper sx={{ border: 1 }}>
        <Grid container spacing={2} alignItems="left" textAlign="center">
          <Grid item xs={12} sm={12} md={12}>
            <Paper sx={{ border: 1 }}>
              <p
                id="viewLogDataIDLabel"
                style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}
              >
                {t('label.viewLogDataIDLabel')}: {data && data.shift_id}
              </p>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            <DataGrid
              ariaDescription={t('ariaLabel.gridTableDescription')}
              ariaTitle={t('ariaLabel.gridTable')}
              data-testid={data}
              columns={columns}
              rows={data.shift_logs && data.shift_logs.logs ? data.shift_logs.logs : []}
              showBorder
              testId="sltLogTableView"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ShiftDataTest;
