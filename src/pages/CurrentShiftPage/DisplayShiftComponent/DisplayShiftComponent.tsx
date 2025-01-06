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
import CheckIcon from '@mui/icons-material/Check';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Autocomplete,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
// import { Kafka } from 'kafkajs';
import { ENTITY, SHIFT_STATUS, operatorName, toUTCDateTimeFormat } from '../../../utils/constants';
import {
  config,
  shiftCreatePath,
  shiftCurrentPath,
  createShiftPath,
  createShiftCommentPath
} from '../../../utils/api_constants';
import apiService from '../../../services/apis';
import ImageDisplayComponent from '../../../components/ImageDisplayComponent/ImageDisplayComponent';
import DisplayShiftLogsComponent from '../DisplayShiftLogsComponent/DisplayShiftLogsComponent';
// import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

function DisplayShiftComponent() {
  const [shiftStatus, setShiftStatus] = useState('');
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [isShiftCommentUpdate, setShiftCommentUpdate] = useState(false);
  const [shiftCommentID, setShiftCommentID] = useState(null);
  const [successMessage, setMessage] = useState('');
  // const [kafkaMessages, setKafkaMessages] = useState([]);
  const [dataDetails, setShiftData] = useState(null);
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [displayModalMessageElement, setDisplayModalMessageElement] = useState(false);
  const [operator, setOperator] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [shiftCommentValue, setShiftComment] = useState('');
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const location = useLocation();
  const [inputValue, setInputValue] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [interval, setIntervalLogs] = useState(null);

  const onEditShiftComment = (shiftCommentItem) => {
    setShiftCommentID(shiftCommentItem.id);
    setOpenSummaryModal(true);
    setShiftCommentUpdate(true);
    setShiftComment(shiftCommentItem.comment);
  };

  const displayShiftComments = (shiftCommentItem) => (
    <div>
      {shiftCommentItem.comment && (
        <span data-testid="shiftComment" style={{ fontWeight: 700, fontSize: '14px' }}>
          {t('label.comments')}:{' '}
        </span>
      )}
      <span>{shiftCommentItem.comment}</span>
      {shiftCommentItem.comment && (
        <Tooltip title="Edit the log comment" placement="bottom-end">
          <DriveFileRenameOutlineIcon
            color="secondary"
            aria-label={t('ariaLabel.edit')}
            data-testid="manageEntityStatus"
            style={{
              cursor: 'pointer',
              position: 'relative',
              top: '7px'
            }}
            onClick={() => onEditShiftComment(shiftCommentItem)}
          />
        </Tooltip>
      )}
    </div>
  );

  const fetchImage = async (commentId) => {
    setImages([]);
    const path = createShiftCommentPath(commentId, 'imageDownload');
    const result = await apiService.getImage(path);
    if (result.status === 200) {
      setImages(result && result.data && result.data[0] ? result.data[0] : []);
    } else {
      setImages([{ isEmpty: true }]);
    }
  };

  // const updateShiftLogs = async () => {
  //   if (kafkaMessages && kafkaMessages.length > 0) {
  //     const path = createShiftPath(shiftId, 'id);
  //     const result = await apiService.getSltLogs(path);
  //     if (result && result.status === 200) {
  //       setShiftData(result && result.data && result.data.length > 0 ? result.data[0] : []);
  //     }
  //   }
  // };

  const updateShiftData = async () => {
    const path = createShiftPath(shiftId, 'id');
    const result = await apiService.getSltLogs(path);
    if (result && result.status === 200) {
      setShiftData(
        result && result.data && result.data.length > 0 && result.data[0] ? result.data[0] : []
      );
    }
  };

  // const useKafkaData = (topic) => {
  //   const kafka = new Kafka({
  //     clientId: window.location.hostname,
  //     brokers: ['localhost:9092']
  //   });
  //   const consumer = kafka.consumer({ groupId: 'my_consumer_group' });
  //   const run = async () => {
  //     await consumer.connect();
  //     await consumer.subscribe({ topic, fromBeginning: true });
  //     await consumer.run({
  //       eachMessage: async ({ message }) => {
  //         setKafkaMessages((prevMessages) => [...prevMessages, message.value.toString()]);
  //       }
  //     });
  //   };
  //   updateShiftLogs();
  //   run().catch(console.error);
  //   return () => {
  //     consumer.disconnect();
  //   };
  // };

  const fetchShiftWithRecentLogs = async (shiftID) => {
    const path = createShiftPath(shiftID, 'id');
    const result = await apiService.getSltLogs(path);
    if (result && result.status === 200) {
      setShiftData(
        result && result.data && result.data.length > 0 && result.data[0] ? result.data[0] : []
      );
    }
  };

  const startNewShift = async () => {
    const shiftData = {
      shift_operator: operator
    };

    const response = await apiService.postShiftData(shiftCreatePath, shiftData);
    if (response.status === 200 && response.data && response.data.length > 0) {
      setMessage('msg.shiftStarted');
      setDisplayMessageElement(true);
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
      setDisableButton(false);
      setShiftId(response.data[0].shift_id);
      setShiftData(
        response && response.data && response.data.length > 0 && response.data[0]
          ? response.data[0]
          : []
      );
      const intervalLogs = setInterval(() => {
        fetchShiftWithRecentLogs(response.data[0].shift_id);
      }, 10000);
      setIntervalLogs(intervalLogs);

      // setShiftData(SHIFT_DATA_LIST[1]);
    }
  };

  const fetchSltCurrentShifts = async () => {
    const response = await apiService.getSltData(shiftCurrentPath);
    if (response.status === 200 && !response.data[0].shift_end) {
      setMessage('msg.shiftAlreadyStarted');
      setDisplayMessageElement(true);
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
      if (response && response.data && response.data.length > 0) {
        setShiftId(response.data[0].shift_id);
        setOperator(response.data[0].shift_operator);
        setShiftData(
          response && response.data && response.data.length > 0 && response.data[0]
            ? response.data[0]
            : []
        );
        setDisableButton(false);
        const intervalLogs = setInterval(() => {
          fetchShiftWithRecentLogs(response.data[0].shift_id);
        }, 10000);
        setIntervalLogs(intervalLogs);
      }
    }
  };

  useEffect(() => {
    fetchSltCurrentShifts();
    // updateShiftLogs();
    // useKafkaData(KafkaTopic.serviceToUITopic);
  }, []);

  const endNewShift = async () => {
    const shiftData = {
      shift_operator: operator
    };
    const path = createShiftPath(shiftId, 'end');
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.shiftEnd');
      setDisableButton(true);
      setDisplayMessageElement(true);
      setOperator('');
      setShiftId('');
      clearInterval(interval);
      setTimeout(() => {
        setDisplayMessageElement(false);
        setShiftComment('');
        setShiftData(null);
      }, 3000);
    }
  };

  const addShiftComments = async () => {
    if (shiftCommentValue === '') return;
    const shiftData = {
      operator_name: operator,
      comment: `${shiftCommentValue}`,
      shift_id: shiftId
    };
    if (isShiftCommentUpdate) {
      const updatePath = createShiftCommentPath(shiftCommentID, 'id');
      const response = await apiService.putShiftData(updatePath, shiftData);
      if (response.status === 200) {
        setMessage('msg.commentSubmit');
        setDisplayModalMessageElement(true);
        setShiftCommentID(response.data[0].id);
        updateShiftData();
        setTimeout(() => {
          // setShiftComment('')
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    } else {
      const addPath = createShiftCommentPath(shiftCommentID, 'basePath');
      const response = await apiService.postShiftData(addPath, shiftData);
      if (response.status === 200) {
        setMessage('msg.commentSubmit');
        setDisplayModalMessageElement(true);
        setShiftCommentID(response.data[0].id);
        updateShiftData();
        setTimeout(() => {
          // setShiftComment('')
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    }
  };

  const setShiftCommentValue = (event) => {
    setShiftComment(event);
  };

  const disableStartShift = () => {
    if (operator && operator.length > 0) {
      return false;
    }
    return true;
  };

  const postShiftCommentImage = async (file) => {
    const formData = new FormData();
    if (shiftCommentID && shiftCommentID > 0) {
      formData.append('files', file);
      const path = createShiftCommentPath(shiftCommentID, 'image');
      const result = await apiService.updateImage(path, formData, config);
      if (result.status === 200) {
        setMessage('msg.imageUpload');
        setDisplayModalMessageElement(true);
        updateShiftData();
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      } else {
        setMessage('msg.imageNotUpload');
        setDisplayModalMessageElement(true);
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    } else {
      formData.append('file', file);
      const path = `shift_comment/upload_image?shift_id=${shiftId}&shift_operator=${operator}`;
      const result = await apiService.addImage(path, formData, config);
      if (result.status === 200) {
        setMessage('msg.imageUpload');
        setDisplayModalMessageElement(true);
        updateShiftData();
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      } else {
        setMessage('msg.imageNotUpload');
        setDisplayModalMessageElement(true);
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    }
  };

  const handleViewImageClose = () => {
    setOpenViewImageModal(false);
    setImages([]);
  };

  const handleOpenImage = (shiftCommentItem) => {
    setOpenViewImageModal(true);
    fetchImage(shiftCommentItem.id);
  };

  const handleSetOpenSummaryModal = () => {
    setShiftCommentID(null);
    setShiftComment('');
    setShiftCommentUpdate(false);
    setOpenSummaryModal(true);
  };

  const handleSummaryModalClose = () => {
    setOpenSummaryModal(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(successMessage)}
      testId="successStatusMsg"
    />
  );

  const renderModalMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(successMessage)}
      testId="successStatusMsg"
    />
  );

  const validateOperator = () => {
    if (operator && operator.length > 0) {
      return false;
    }
    return true;
  };

  const shiftAction = (value) => {
    setShiftStatus(value);
    setOpenDialog(true);
  };

  const newShiftConfirmation = (confirmation) => {
    if (confirmation === SHIFT_STATUS.YES && shiftStatus === SHIFT_STATUS.START) {
      setOpenDialog(false);
      startNewShift();
    } else if (confirmation === SHIFT_STATUS.YES && shiftStatus === SHIFT_STATUS.END) {
      setOpenDialog(false);
      endNewShift();
    }
    setOpenDialog(false);
    return false;
  };

  const startShiftAlertTitle = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography variant="h5">{t('msg.startNewShiftLabel')}</Typography>
      </Grid>
    </Grid>
  );

  const startShiftAlertContent = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography>{t('msg.startNewShiftMsg')}</Typography>
        <Typography>{t('msg.confirmShiftMsg')}</Typography>
      </Grid>
    </Grid>
  );

  const endShiftAlertTitle = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography variant="h5">{t('msg.endNewShiftLabel')}</Typography>
      </Grid>
    </Grid>
  );

  const onUpdateCommentsEvent = () => {
    updateShiftData();
  };

  const endShiftAlertContent = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography>{t('msg.endNewShiftMsg')}</Typography>
        <Typography>{t('msg.confirmShiftMsg')}</Typography>
      </Grid>
    </Grid>
  );
  return (
    <>
      <Box sx={{ marginLeft: 2, marginTop: 0, marginBottom: 2, position: 'relative' }}>
        <Grid container justifyContent="start">
          <Grid item xs={12} sm={12} md={3}>
            <h2 style={{ margin: 0, marginBottom: '10px' }} data-testid="manageShift">
              {t('label.manageShift')}
            </h2>
          </Grid>
          <Grid item xs={12} sm={12} md={2} />
          <Grid item xs={12} sm={12} md={4}>
            <div style={{ position: 'absolute', zIndex: 2 }}>
              {displayMessageElement ? renderMessageResponse() : ''}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={1} />
          <Grid item xs={12} sm={12} md={2}>
            <Link to="/history" style={{ color: ButtonColorTypes.Inherit }}>
              <Button
                icon={<HistoryIcon />}
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
      </Box>

      <Paper sx={{ border: '1px solid darkgrey', margin: 2, marginTop: 0, marginBottom: 1 }}>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12} sm={12} md={2.7}>
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

          <Grid item xs={12} sm={12} md={2} sx={{ marginTop: 2 }}>
            <Button
              size={ButtonSizeTypes.Small}
              icon={<AccessTimeIcon />}
              disabled={disableStartShift() || !disableButton}
              ariaDescription="Button for starting shift"
              label={t('label.shiftStart')}
              testId="shiftStartButton"
              onClick={() => shiftAction('START')}
              variant={ButtonVariantTypes.Contained}
              color={ButtonColorTypes.Secondary}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3} sx={{ marginTop: 2 }}>
            <Chip
              label={
                dataDetails && dataDetails.shift_start
                  ? `Shift started at ${toUTCDateTimeFormat(dataDetails.shift_start)}`
                  : t('label.shiftNotStarted')
              }
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3} sx={{ marginTop: 2 }}>
            <Button
              size={ButtonSizeTypes.Small}
              icon={<AddIcon />}
              disabled={disableButton}
              ariaDescription="Button for submitting comment"
              label={t('label.addShiftComments')}
              testId="addShiftComments"
              onClick={handleSetOpenSummaryModal}
              variant={ButtonVariantTypes.Contained}
              color={ButtonColorTypes.Secondary}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={1.3} sx={{ marginTop: 2 }}>
            <Button
              size={ButtonSizeTypes.Small}
              icon={<AccessTimeIcon />}
              disabled={disableButton}
              ariaDescription="Button for ending shift"
              label={t('label.shiftEnd')}
              testId="shiftEndButton"
              onClick={() => shiftAction('END')}
              variant={ButtonVariantTypes.Contained}
              color={ButtonColorTypes.Error}
            />
          </Grid>
        </Grid>
        {dataDetails && dataDetails.comments && dataDetails.comments.length > 0 && (
          <Divider style={{ marginTop: '20px' }} />
        )}

        <Grid container sx={{ padding: 2, paddingTop: 0, maxHeight: '500px', overflowY: 'scroll' }}>
          <Grid item xs={12} sm={12} md={12}>
            {dataDetails && dataDetails.comments && dataDetails.comments.length > 0 && (
              <p
                data-testid="viewShiftComments"
                style={{
                  textDecoration: 'underline',
                  fontWeight: 900,
                  fontSize: '18px',
                  marginBottom: 0
                }}
              >
                {t('label.viewShiftComments')}
              </p>
            )}
            {dataDetails &&
              dataDetails.comments &&
              dataDetails.comments.length > 0 &&
              dataDetails.comments.map((shiftCommentItem, shiftCommentIndex) => (
                <div key={shiftCommentItem.id}>
                  <Grid container justifyContent="start">
                    <Grid item xs={12} sm={12} md={4}>
                      <p data-testid="commentedAt">
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>
                          {t('label.commentedAt')} :{' '}
                        </span>{' '}
                        <span>
                          {shiftCommentItem &&
                          shiftCommentItem.metadata &&
                          shiftCommentItem.metadata.created_on
                            ? toUTCDateTimeFormat(shiftCommentItem.metadata.created_on)
                            : 'NA'}
                        </span>
                      </p>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                      <Chip
                        size="small"
                        color="secondary"
                        style={{
                          cursor: 'pointer',
                          marginTop: '10px'
                        }}
                        data-testid="viewShiftCommentImages"
                        onClick={() => handleOpenImage(shiftCommentItem)}
                        label={`${t('label.viewImages')} (${shiftCommentItem.image ? shiftCommentItem.image.length : 0})`}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="start">
                    <Grid item xs={12} sm={12} md={12}>
                      {shiftCommentItem &&
                        shiftCommentItem.comment &&
                        displayShiftComments(shiftCommentItem)}
                    </Grid>
                  </Grid>

                  {shiftCommentIndex !== dataDetails.comments.length - 1 && (
                    <Divider style={{ marginTop: '15px' }} />
                  )}
                </div>
              ))}
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ border: '1px solid darkgrey', margin: 2, marginTop: 0 }}>
        <p
          data-testid="logSummary"
          style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}
        >
          {t('label.logSummary')}
        </p>
        <Divider />
        {dataDetails && dataDetails.shift_logs && dataDetails.shift_logs.length > 0 ? (
          <DisplayShiftLogsComponent
            isCurrentShift
            updateCommentsEvent={onUpdateCommentsEvent}
            shiftData={dataDetails}
          />
        ) : (
          <div style={{ margin: '15px', width: '50%' }}>
            <InfoCard
              minHeight="15px"
              fontSize={16}
              color={InfoCardColorTypes.Info}
              message={t('label.noLogsFound')}
              testId="noShiftLogFound"
            />
          </div>
        )}
      </Paper>

      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="addShiftCommentModal"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px'
            }
          }
        }}
        open={openSummaryModal}
        onClose={handleSummaryModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        {!isShiftCommentUpdate && (
          <DialogTitle>
            <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
              <Grid item xs={12} sm={12} md={4} data-testid="addShiftCommentTitle">
                {t('label.addCommentsAndImages')}
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ position: 'absolute', zIndex: 2, left: '40%', top: '-25%' }}
              >
                {displayModalMessageElement ? renderModalMessageResponse() : ''}
              </Grid>
            </Grid>
          </DialogTitle>
        )}
        {isShiftCommentUpdate && (
          <DialogTitle>
            <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
              <Grid item xs={12} sm={12} md={5} data-testid="addShiftCommentTitle">
                {t('label.updateCommentsAndImages')}
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                style={{ position: 'absolute', zIndex: 2, left: '40%', top: '-25%' }}
              >
                {displayModalMessageElement ? renderModalMessageResponse() : ''}
              </Grid>
            </Grid>
          </DialogTitle>
        )}
        <DialogContent dividers>
          <Grid container spacing={2} justifyContent="left">
            <Grid item xs={12} sm={12} md={8}>
              {!isShiftCommentUpdate && (
                <p
                  data-testid="addShiftComment"
                  style={{
                    textDecoration: 'underline',
                    fontWeight: 900,
                    fontSize: '18px',
                    marginBottom: 0
                  }}
                >
                  {t('label.addShiftComments')}
                </p>
              )}
              {isShiftCommentUpdate && (
                <p
                  data-testid="addShiftComment"
                  style={{
                    textDecoration: 'underline',
                    fontWeight: 900,
                    fontSize: '18px',
                    marginBottom: 0
                  }}
                >
                  {t('label.updateShiftComments')}
                </p>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="left">
            <Grid item xs={12} sm={12} md={8}>
              <TextEntry
                setValue={setShiftCommentValue}
                rows={3}
                label="Please enter shift comments"
                value={shiftCommentValue}
                testId="operatorShiftComment"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} marginTop={10}>
              <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                ariaDescription="Button for submitting comment"
                label={t('label.add')}
                testId="shiftCommentButton"
                onClick={addShiftComments}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="left">
            <div>
              <p
                style={{
                  textDecoration: 'underline',
                  fontWeight: 900,
                  fontSize: '18px',
                  marginLeft: '17px',
                  marginBottom: 0,
                  marginTop: '25px'
                }}
              >
                {t('label.addImages')}
              </p>
            </div>
            <Grid item xs={12} sm={12} md={12}>
              <div style={{ float: 'left' }}>
                <FileUpload
                  chooseColor={ButtonColorTypes.Secondary}
                  chooseVariant={ButtonVariantTypes.Contained}
                  clearLabel="Remove"
                  clearVariant={ButtonVariantTypes.Outlined}
                  buttonSize={ButtonSizeTypes.Small}
                  testId="shiftImageFileUpload"
                  uploadFunction={postShiftCommentImage}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size={ButtonSizeTypes.Small}
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="shiftCommentModalClose"
            label={t('label.close')}
            onClick={handleSummaryModalClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="confirmationDialog"
        fullWidth
        open={openDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {shiftStatus && shiftStatus === SHIFT_STATUS.START
            ? startShiftAlertTitle()
            : endShiftAlertTitle()}
        </DialogTitle>
        <DialogContent>
          {shiftStatus && shiftStatus === SHIFT_STATUS.START
            ? startShiftAlertContent()
            : endShiftAlertContent()}
        </DialogContent>
        <DialogActions>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Button
                icon={<ClearIcon />}
                size={ButtonSizeTypes.Small}
                ariaDescription="Button for history tab"
                label="NO"
                color={ButtonColorTypes.Inherit}
                testId="confirmationDialogNo"
                variant={ButtonVariantTypes.Contained}
                onClick={() => newShiftConfirmation('NO')}
              />
            </Grid>
            <Grid item>
              <Button
                color={ButtonColorTypes.Inherit}
                icon={<CheckIcon />}
                size={ButtonSizeTypes.Small}
                ariaDescription="Button for history tab"
                label="yes"
                onClick={() => newShiftConfirmation('YES')}
                testId="confirmationDialogYes"
                variant={ButtonVariantTypes.Contained}
              />
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
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
        open={openViewImageModal}
        onClose={handleViewImageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>{t('label.viewImages')}</DialogTitle>
        <DialogContent dividers>
          {images ? <ImageDisplayComponent images={images} /> : <p>{t('label.noImageFound')}</p>}
        </DialogContent>
        <DialogActions>
          <Button
            size={ButtonSizeTypes.Small}
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="statusClose"
            label={t('label.close')}
            onClick={handleViewImageClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DisplayShiftComponent;
