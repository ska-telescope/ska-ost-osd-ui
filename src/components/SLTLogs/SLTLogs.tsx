import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonVariantTypes,
  DropDown,
  FileUpload,
  InfoCard,
  InfoCardColorTypes,
  ButtonColorTypes,
  ButtonSizeTypes
} from '@ska-telescope/ska-gui-components';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { ENTITY, DEFAULT_TIME, operatorName } from '../../utils/constants';
import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';
import ImageDisplay from './ImageDisplay';

const RequestResponseDisplay = ({ responseArray }) => {
  const { t } = useTranslation('translations');
  let id = 1;
  if (responseArray && responseArray.length > 0) {
    responseArray.map((row) => {
      row.id = id++;
      return row;
    });
  }
  return (
    <div>
      {responseArray &&
        responseArray.map((dataItem) => (
          <div key={dataItem.id}>
            <p>
              <b> {t('label.commandName')}:</b> {dataItem.request}
            </p>
            <p>
              <b>{t('label.status')}:</b> {dataItem.status}
            </p>
            <p>
              <b>{t('label.requestSentAt')}:</b> {dataItem.request_sent_at}
            </p>
            <p>
              <b>{t('label.details')}:</b>{' '}
              {dataItem.status === 'OK' ? dataItem.response.result : dataItem.error.detail}
            </p>
            <hr />
          </div>
        ))}
    </div>
  );
};

function SLTLogs() {
  const [shiftStart, setShiftStart] = useState(DEFAULT_TIME);
  const [shiftEnd, setShiftEnd] = useState(DEFAULT_TIME);
  const [openModal, setOpenModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dataDetails, setSltLogs] = useState([]);
  const [startShift, setStartShift] = useState(false);
  const [showElement, setShowElement] = useState(false);
  const [operator, setOperator] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [commentValue, setComment] = useState('');
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const location = useLocation();
  const [interval, setItervalLogs] = useState(null);
  const [EBData, setIEBData] = useState(null);
  const [openModalEB, setOpenModalEB] = useState(false);

  const fetchImage = async () => {
    const path = `shifts/images/${shiftId}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data.data);
  };
  const updateLogs = async (sid) => {
    const path = `shifts/${sid}`;
    const result = await apiService.getSltLogs(path);
    if (dataDetails && dataDetails.length === 0) {
      setSltLogs(
        result && result.data && result.data.shift_logs && result.data.shift_logs.length > 0
          ? result.data.shift_logs
          : []
      );
    }
    if (
      dataDetails &&
      dataDetails.length < result &&
      result.data &&
      result.data.shift_logs &&
      result.data.shift_logs.length
    ) {
      setSltLogs(
        result && result.data && result.data.shift_logs && result.data.shift_logs.length > 0
          ? result.data.shift_logs
          : []
      );
    }
  };
  const getShiftStartTime = async () => {
    // setStatusMessage('msg.shiftStarted');
    if (operator.length === 0) {
      // validateOperator();
      setShowElement(true);
      setStatusMessage('msg.selectOperator');
      setTimeout(() => {
        setShowElement(false);
      }, 3000);
    } else {
      setStartShift(true);

      const shiftData = {
        shift_operator: { name: operator },
        shift_start: moment().utc().toISOString()
      };

      const path = `shifts`;
      const response = await apiService.postShiftData(path, shiftData);

      if (response.status === 200) {
        setStatusMessage('msg.shiftStarted');
        setShowElement(true);
      }

      setTimeout(() => {
        setShowElement(false);
      }, 3000);
      if (response && response.data && response.data.data) {
        setShiftStart(moment(response.data.data.shift_start).utc().format('YYYY-MM-DD HH:mm:ss'));
        setShiftId(response.data.data.sid);
        setSltLogs(
          response &&
            response.data &&
            response.data.data.shift_logs &&
            response.data.data.shift_logs.length > 0
            ? response.data.data.shift_logs
            : []
        );
        const intervel = setInterval(() => {
          updateLogs(response && response.data && response.data.data && response.data.data.sid);
        }, 5000);
        setItervalLogs(intervel);
      }
    }
  };
  const fetchSltCurrentShifts = async () => {
    const path = `current_shifts`;
    const response = await apiService.getSltData(path);
    if (response.status === 200 && !response.data.shift_end) {
      setStatusMessage('msg.shiftAlreadyStarted');
      setShowElement(true);
      setTimeout(() => {
        setShowElement(false);
      }, 3000);
      if (response && response.data && response.data) {
        setStartShift(true);
        setShiftStart(moment(response.data.shift_start).format('YYYY-MM-DD HH:mm:ss'));
        setShiftId(response.data.sid);
        setOperator(response.data.shift_operator.name);
        setComment(response.data.comments ? response.data.comments : '');
      }
      const intervel = setInterval(() => {
        updateLogs(response && response.data && response.data.sid);
      }, 5000);
      setItervalLogs(intervel);
    }
  };
  useEffect(() => {
    fetchSltCurrentShifts();
  }, []);
  const getShiftEndTime = async () => {
    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStart,
      shift_end: moment().utc().toISOString(),
      sid: shiftId,
      comments: commentValue
    };

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    setShiftEnd(
      moment(response && response.data && response.data.data && response.data.data.shift_end)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')
    );

    setStatusMessage('msg.shiftEnd');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
      setStartShift(false);
      setOperator('');
      setShiftStart(DEFAULT_TIME);
      setShiftStart(DEFAULT_TIME);
      setShiftEnd(DEFAULT_TIME);
      setComment('');
      clearInterval(interval);
    }, 3000);
  };

  const addComment = async () => {
    if (commentValue === '') return;

    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStart,
      comments: `${commentValue}`
    };

    const path = `shifts/${shiftId}`;
    await apiService.putShiftData(path, shiftData);

    setStatusMessage('msg.commentSubmit');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 3000);
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const disableStartShift = () => {
    if (startShift === true) {
      return true;
    }
    return false;
  };

  const disableButtons = () => {
    if (startShift === false) {
      return true;
    }
    return false;
  };

  const postImage = async (file) => {
    const path = `shifts/images/${shiftId}`;

    const formData = new FormData();
    formData.append('files', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data'
      }
    };
    await apiService.postImage(path, formData, config);

    setStatusMessage('msg.imageUpload');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 3000);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const handleOpenImage = () => {
    fetchImage();
    setOpenModal(true);
  };
  const renderMessageResponse = () => (
    <InfoCard
      fontSize={20}
      color={InfoCardColorTypes.Success}
      message={t(statusMessage)}
      testId="successStatusMsg"
    />
  );

  const validateOperator = () => {
    if (operator.length === 0) {
      return t('msg.selectOperator');
    }
    return '';
  };

  const onTriggerFunction = (ebData) => {
    setIEBData(ebData.request_responses);
    setOpenModalEB(true);
  };
  const handleCloseRequestResponse = () => {
    setOpenModalEB(false);
  };

  return (
    <Box>
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
        open={openModalEB}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>{t('label.ebRequestResponse')}</DialogTitle>
        <DialogContent dividers>
          <RequestResponseDisplay responseArray={EBData} />
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
      <Grid container sx={{ margin: 2, marginBottom: 0, marginTop: 0 }} justifyContent="end">
        <Grid item xs={12} sm={12} md={3}>
          <h2 data-testid="manageShift">{t('label.manageShift')}</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={1} />
        <Grid item xs={12} sm={12} md={4}>
          {showElement ? renderMessageResponse() : ''}
        </Grid>
        <Grid item xs={12} sm={12} md={2} />
        <Grid item xs={12} sm={12} md={2}>
          <Link to="/history" style={{ color: ButtonColorTypes.Inherit }}>
            <Button
              icon={<HistoryIcon />}
              size={ButtonSizeTypes.Large}
              ariaDescription="Button for history tab"
              label={t('label.history')}
              testId="historyButton"
              color={
                location.pathname === `/${ENTITY.shiftHistory}`
                  ? ButtonColorTypes.Secondary
                  : ButtonColorTypes.Inherit
              }
              variant={ButtonVariantTypes.Contained}
            />
          </Link>
        </Grid>
      </Grid>

      <Paper sx={{ border: 1, margin: 2, marginTop: 0 }}>
        <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 0 }} justifyContent="center">
          <Grid item sx={{ padding: 10 }} xs={12} sm={12} md={3}>
            <DropDown
              errorText={validateOperator()}
              options={operatorName}
              testId="operatorNameId"
              value={operator}
              setValue={setOperator}
              label={t('label.operatorName')}
              labelBold
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} />
          <Grid item xs={12} sm={12} md={5}>
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  <span data-testid="shiftStart">{t('label.shiftStart')}</span>: {shiftStart}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={5}>
                <Button
                  icon={<AccessTimeIcon />}
                  size={ButtonSizeTypes.Large}
                  disabled={disableStartShift()}
                  ariaDescription="Button for starting shift"
                  label={t('label.shiftStart')}
                  testId="shiftStartButton"
                  onClick={getShiftStartTime}
                  variant={ButtonVariantTypes.Contained}
                  color={ButtonColorTypes.Secondary}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  <span data-testid="shiftEnd">{t('label.shiftEnd')}</span>: {shiftEnd}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={5}>
                <Button
                  icon={<AccessTimeIcon />}
                  size={ButtonSizeTypes.Large}
                  disabled={disableButtons()}
                  ariaDescription="Button for ending shift"
                  label={t('label.shiftEnd')}
                  testId="shiftEndButton"
                  onClick={getShiftEndTime}
                  variant={ButtonVariantTypes.Contained}
                  color={ButtonColorTypes.Error}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container sx={{ padding: 2, paddingTop: 0 }} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={5}>
            <p data-testid="addComment" style={{ fontWeight: 'bold' }}>
              {t('label.addComment')}
            </p>

            <TextField
              sx={{ width: '100%' }}
              data-testid="operatorComment"
              label="Please enter comments..."
              multiline
              rows={3}
              value={commentValue}
              onChange={handleChange}
            />
            <Grid item paddingTop={1} paddingBottom={1} xs={12} sm={12} md={6}>
              <Button
                icon={<AddIcon />}
                disabled={disableButtons()}
                ariaDescription="Button for submitting comment"
                label={t('label.submit')}
                testId="commentButton"
                onClick={addComment}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
            </Grid>
          </Grid>
          <Grid item paddingTop={1} xs={12} sm={12} md={1} />
          <Grid item paddingTop={1} xs={12} sm={12} md={6}>
            <Grid container spacing={2} justifyContent="right" marginBottom={2}>
              <Grid item xs={12} sm={12} md={3}>
                <span data-testid="addImages" style={{ fontWeight: 'bold' }}>
                  {t('label.addImages')}
                </span>
              </Grid>
              <Grid item xs={12} sm={12} md={6} />
              <Grid item xs={12} sm={12} md={3}>
                <span
                  aria-hidden="true"
                  data-testid="viewImages"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onKeyDown={handleOpenImage}
                  onClick={handleOpenImage}
                >
                  {t('label.viewImages')}
                </span>
              </Grid>
            </Grid>

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
              <DialogTitle>{t('label.viewImages')}</DialogTitle>
              <DialogContent dividers>
                <ImageDisplay images={images} />
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
            <FileUpload
              uploadFunction={postImage}
              chooseDisabled={disableButtons()}
              testId="fileId"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ border: 1, margin: 2 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
          {t('label.logSummary')}
        </p>
        <hr />
        {dataDetails ? <SLTLogTableList updatedList={onTriggerFunction} data={dataDetails} /> : ''}
      </Paper>
    </Box>
  );
}

export default SLTLogs;
