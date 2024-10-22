/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonVariantTypes,
  FileUpload,
  InfoCard,
  InfoCardColorTypes,
  ButtonColorTypes,
  ButtonSizeTypes,
  TextEntry
} from '@ska-telescope/ska-gui-components';
import {
  Autocomplete,
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
import { Kafka } from 'kafkajs';
import { ENTITY, DEFAULT_TIME, operatorName } from '../../utils/constants';
import apiService from '../../services/apis';
import ImageDisplay from './ImageDisplay';
import ShiftLogs from './ShiftLogs';

const useKafkaData = (topic) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const kafka = new Kafka({
      clientId: window.location.hostname,
      brokers: ['kafka-cluster-kafka-bootstrap:9092']
    });
    const consumer = kafka.consumer({ groupId: 'my_consumer_group' });
    const run = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ message }) => {
          setMessages((prevMessages) => [...prevMessages, message.value.toString()]);
        }
      });
    };
    run().catch(console.error);
    return () => {
      consumer.disconnect();
    };
  }, [topic]);
  return messages;
};

function CurrentActiveShift() {
  const [displayShiftStart, setDisplayShiftStart] = useState(DEFAULT_TIME);
  const [shiftStart, setShiftStart] = useState('');
  const [displayShiftEnd, setDisplayShiftEnd] = useState(DEFAULT_TIME);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState('');
  const [dataDetails, setSltLogs] = useState([]);
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [operator, setOperator] = useState(null);
  const [shiftId, setShiftId] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [commentValue, setComment] = useState('');
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const location = useLocation();
  const [inputValue, setInputValue] = React.useState('');
  const messages = useKafkaData('slt-to-frontend-topic');

  const fetchImage = async () => {
    const path = `shifts/download_image/${shiftId}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data[0]);
  };

  const updateShiftLogs = async (shiftID) => {
    if (messages && message.length > 0) {
      const path = `shift?shift_id=${shiftID}`;
      const result = await apiService.getSltLogs(path);
      if (dataDetails && dataDetails.length === 0) {
        setSltLogs(
          result && result.data && result.data.length > 0 && result.data[0].shift_logs
            ? result.data[0].shift_logs
            : []
        );
      }
    }
  };

  const startNewShift = async () => {
    const shiftData = {
      shift_operator: operator
    };
    const path = `shifts/create`;
    const response = await apiService.postShiftData(path, shiftData);
    if (response.status === 200 && response.data && response.data.length > 0) {
      setMessage('msg.shiftStarted');
      setDisplayMessageElement(true);
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
      setDisableButton(false);
      setShiftStart(response.data[0].shift_start);
      setDisplayShiftStart(
        moment(response.data[0].shift_start).utc().format('DD-MM-YYYY HH:mm:ss')
      );
      setShiftId(response.data[0].shift_id);
      setSltLogs(
        response && response.data[0].shift_logs && response.data[0].shift_logs.length > 0
          ? response.data[0].shift_logs
          : []
      );
      updateShiftLogs(response.data[0].shift_id);
    }
  };

  const fetchSltCurrentShifts = async () => {
    const path = `shifts/current_shift`;
    const response = await apiService.getSltData(path);
    if (response.status === 200 && !response.data.shift_end) {
      setMessage('msg.shiftAlreadyStarted');
      setDisplayMessageElement(true);
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
      if (response && response.data && response.data) {
        setDisplayShiftStart(moment(response.data.shift_start).format('DD-MM-YYYY HH:mm:ss'));
        setShiftId(response.data[0].shift_id);
        setOperator(response.data.shift_operator.name);
        setComment(response.data.comments ? response.data.comments : '');
      }
    }
  };
  useEffect(() => {
    fetchSltCurrentShifts();
  }, []);

  const endNewShift = async () => {
    const shiftData = {
      shift_operator: operator,
      shift_start: shiftStart,
      shift_end: moment().utc().toISOString(),
      comments: `${commentValue}`
    };

    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.shiftEnd');
      setDisplayMessageElement(true);
      setDisplayShiftEnd(moment(response.data[0].shift_end).utc().format('DD-MM-YYYY HH:mm:ss'));
      setTimeout(() => {
        setDisplayMessageElement(false);
        setOperator('');
        setDisplayShiftStart(DEFAULT_TIME);
        setDisplayShiftEnd(DEFAULT_TIME);
        setComment('');
      }, 3000);
    }
  };

  const addShiftComments = async () => {
    if (commentValue === '') return;

    const shiftData = {
      shift_operator: operator,
      comments: `${commentValue}`
    };
    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.commentSubmit');
      setDisplayMessageElement(true);
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
    }
  };

  const setCommentValue = (event) => {
    setComment(event);
  };

  const disableStartShift = () => {
    if (operator && operator.length > 0) {
      return false;
    }
    return true;
  };

  const postImage = async (file) => {
    const path = `shifts/upload_image/${shiftId}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data'
      }
    };
    await apiService.postImage(path, formData, config);

    setMessage('msg.imageUpload');
    setDisplayMessageElement(true);
    setTimeout(() => {
      setDisplayMessageElement(false);
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
      minHeight="50"
      fontSize={20}
      color={InfoCardColorTypes.Success}
      message={t(message)}
      testId="successStatusMsg"
    />
  );

  const validateOperator = () => {
    if (operator && operator.length > 0) {
      return false;
    }
    return true;
  };

  return (
    <Box>
      <Grid container sx={{ margin: 2, marginBottom: 0, marginTop: 0 }} justifyContent="end">
        <Grid item xs={12} sm={12} md={3}>
          <h2 data-testid="manageShift">{t('label.manageShift')}</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={1} />
        <Grid item xs={12} sm={12} md={4}>
          {displayMessageElement ? renderMessageResponse() : ''}
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
        <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 0 }} justifyContent="left">
          <Grid item sx={{ padding: 10 }} xs={12} sm={12} md={3}>
            <Autocomplete
              value={operator}
              onChange={(event, newValue: string | null) => {
                setOperator(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              data-testid="operatorName"
              options={operatorName}
              renderInput={(params) => (
                <TextField
                  error={validateOperator()}
                  helperText={t('msg.selectOperator')}
                  {...params}
                  label={t('label.operatorName')}
                  variant="standard"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} />

          <Grid item xs={12} sm={12} md={5}>
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  <span data-testid="shiftStart">{t('label.shiftStart')}</span>: {displayShiftStart}
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
                  onClick={startNewShift}
                  variant={ButtonVariantTypes.Contained}
                  color={ButtonColorTypes.Secondary}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  <span data-testid="shiftEnd">{t('label.shiftEnd')}</span>: {displayShiftEnd}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={5}>
                <Button
                  icon={<AccessTimeIcon />}
                  size={ButtonSizeTypes.Large}
                  disabled={disableButton}
                  ariaDescription="Button for ending shift"
                  label={t('label.shiftEnd')}
                  testId="shiftEndButton"
                  onClick={endNewShift}
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
            <TextEntry
              setValue={setCommentValue}
              rows={2}
              label="Please enter comments..."
              value={commentValue}
              testId="operatorComment"
            />
            <Grid item paddingTop={1} paddingBottom={1} xs={12} sm={12} md={6}>
              <Button
                icon={<AddIcon />}
                disabled={disableButton}
                ariaDescription="Button for submitting comment"
                label={t('label.submit')}
                testId="commentButton"
                onClick={addShiftComments}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
            </Grid>
          </Grid>
          <Grid item paddingTop={1} xs={12} sm={12} md={1} />
          <Grid item paddingTop={1} xs={12} sm={12} md={6}>
            <Grid container spacing={2} justifyContent="right" marginBottom={2}>
              <Grid item xs={12} sm={12} md={3}>
                <p data-testid="addImages" style={{ fontWeight: 'bold' }}>
                  {t('label.addImages')}
                </p>
              </Grid>
              <Grid item xs={12} sm={12} md={6} />
              <Grid item xs={12} sm={12} md={3}>
                <p
                  aria-hidden="true"
                  data-testid="viewImages"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onKeyDown={handleOpenImage}
                  onClick={handleOpenImage}
                >
                  {t('label.viewImages')}
                </p>
              </Grid>
            </Grid>

            <Dialog
              aria-label={t('ariaLabel.dialog')}
              data-testid="dialogStatus"
              sx={{
                '& .MuiDialog-container': {
                  '& .MuiPaper-root': {
                    width: '100%',
                    maxWidth: '1000px'
                  }
                }
              }}
              open={openModal}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle>{t('label.viewImages')}</DialogTitle>
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
            <FileUpload uploadFunction={postImage} chooseDisabled={disableButton} testId="fileId" />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ border: 1, margin: 2 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
          {t('label.logSummary')}
        </p>
        <hr />
        {dataDetails && dataDetails.length > 0 ? (
          <ShiftLogs logData={dataDetails} />
        ) : (
          <p style={{ padding: '10px' }}>{t('label.noLogsFound')}</p>
        )}
      </Paper>
    </Box>
  );
}

export default CurrentActiveShift;
