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
  Typography,
  useTheme
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Kafka } from 'kafkajs';
import { ENTITY, operatorName, toUTCDateTimeFormat } from '../../utils/constants';
import apiService from '../../services/apis';
import ImageDisplay from './ImageDisplay';
import ShiftLogs from './ShiftLogs';

function CurrentActiveShift() {
  const theme = useTheme();
  const [shiftStart, setShiftStart] = useState('');
  const [shiftStatus, setShiftStatus] = useState('');
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [isShiftCommentUpdate, setShiftCommentUpdate] = useState(false);
  const [shiftCommentID, setShiftCommentID] = useState('');
  const [successMessage, setMessage] = useState('');
  const [kafkaMessages, setKafkaMessages] = useState([]);
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

  const onEditShiftComment = (shiftCommentIndex, shiftCommentItem) => {
    console.log('onEditShiftComment', shiftCommentIndex, shiftCommentItem);
    setShiftCommentID(shiftCommentItem);
    console.log('shiftCommentID', shiftCommentID);
    setOpenSummaryModal(true);
    setShiftCommentUpdate(true);
    setShiftComment(shiftCommentItem.shift_comments);

    // dataDetails["shift_comment"][shiftCommentIndex]["shift_comments"]["isEdit"]=true;
    // setShiftComment(shiftCommentItem["shift_comments"])
    // setLogComment(shiftData["shift_logs"][logIndex]["log_comment"][commentIndex])
  };

  const displayShiftComments = (shiftCommentIndex, shiftCommentItem) => (
    <div>
      <span>{shiftCommentItem.shift_comments}</span>
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
          onClick={() => onEditShiftComment(shiftCommentIndex, shiftCommentItem)}
        />
      </Tooltip>{' '}
    </div>
  );

  const fetchImage = async () => {
    const path = `shifts/download_image/${shiftId}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data[0]);
  };

  const updateShiftLogs = async () => {
    if (kafkaMessages && kafkaMessages.length > 0) {
      const path = `shift?shift_id=${shiftId}`;
      const result = await apiService.getSltLogs(path);
      if (result && result.status === 200) {
        setShiftData(
          result && result.data && result.data.length > 0 && result.data[0] ? result.data[0] : []
        );
      }
    }
  };

  const useKafkaData = (topic) => {
    const kafka = new Kafka({
      clientId: window.location.hostname,
      brokers: ['localhost:9092']
    });
    const consumer = kafka.consumer({ groupId: 'my_consumer_group' });
    const run = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ message }) => {
          console.log('kafkaMessages', kafkaMessages);
          setKafkaMessages((prevMessages) => [...prevMessages, message.value.toString()]);
        }
      });
    };
    updateShiftLogs();
    run().catch(console.error);
    return () => {
      consumer.disconnect();
    };
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

      setShiftId(response.data[0].shift_id);
      setShiftData(
        response && response.data && response.data.length > 0 && response.data[0]
          ? response.data[0]
          : []
      );
      setShiftData({
        shift_id: 'shift-20241028-148',
        shift_start: '2024-10-22T11:24:04.389077Z',
        shift_operator: 'john',
        shift_comment: [
          {
            shift_comments:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            created_on: '2024-10-22T11:24:14.406107Z',
            id: 1,
            isEdit: false
          },
          {
            shift_comments:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            created_on: '2024-10-22T11:24:14.406107Z',
            id: 2,
            isEdit: false
          }
        ],
        shift_logs: [
          {
            info: {
              eb_id: 'eb-t0001-20241022-00002',
              sbd_ref: 'sbd-t0001-20240822-00008',
              sbi_ref: 'sbi-t0001-20240822-00009',
              metadata: {
                version: 1,
                created_by: 'DefaultUser',
                created_on: '2024-10-22T11:25:36.953526Z',
                pdm_version: '15.4.0',
                last_modified_by: 'DefaultUser',
                last_modified_on: '2024-10-22T11:25:36.953526Z'
              },
              interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
              telescope: 'ska_mid',
              sbi_status: 'failed',
              sbd_version: 1,
              request_responses: [
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.scan',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  error: { detail: 'this is an error' },
                  status: 'ERROR',
                  request: 'ska_oso_scripting.functions.devicecontrol.end',
                  request_sent_at: '2022-09-23T15:43:53.971548Z'
                }
              ]
            },
            source: 'ODA',
            log_time: '2024-10-22T11:24:14.406107Z',
            log_comment: [
              {
                logcomments: 'Lorem Ipsum is simply dummy text of the printing ',
                logCommentTime: '23-10-2024',
                id: 1,
                isEdit: false
              },
              {
                logcomments:
                  'Submitting Comments: We will implement a function to handle the submission of comments, making a POST request to the API for each comment',
                logCommentTime: '23-10-2024',
                id: 2,
                isEdit: false
              },
              {
                logcomments:
                  'Handling Input Changes: We will ensure that each text field can be updated independently.',
                logCommentTime: '23-10-2024',
                id: 3,
                isEdit: false
              }
            ]
          },
          {
            info: {
              eb_id: 'eb-t0001-20241022-00002',
              sbd_ref: 'sbd-t0001-20240822-00008',
              sbi_ref: 'sbi-t0001-20240822-00009',
              metadata: {
                version: 1,
                created_by: 'DefaultUser',
                created_on: '2024-10-22T11:25:36.953526Z',
                pdm_version: '15.4.0',
                last_modified_by: 'DefaultUser',
                last_modified_on: '2024-10-22T11:25:36.953526Z'
              },
              interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
              telescope: 'ska_mid',
              sbi_status: 'failed',
              sbd_version: 1,
              request_responses: [
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.scan',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z'
                },
                {
                  error: { detail: 'this is an error' },
                  status: 'ERROR',
                  request: 'ska_oso_scripting.functions.devicecontrol.end',
                  request_sent_at: '2022-09-23T15:43:53.971548Z'
                }
              ]
            },
            source: 'ODA',
            log_time: '2024-10-22T11:24:14.406107Z',
            log_comment: [
              {
                logcomments: '222Lorem Ipsum is simply dummy text of the printing ',
                logCommentTime: '23-10-2024',
                id: 1,
                isEdit: false
              },
              {
                logcomments:
                  '22Submitting Comments: We will implement a function to handle the submission of comments, making a POST request to the API for each comment',
                logCommentTime: '23-10-2024',
                id: 2,
                isEdit: false
              },
              {
                logcomments:
                  '22Handling Input Changes: We will ensure that each text field can be updated independently.',
                logCommentTime: '23-10-2024',
                id: 3,
                isEdit: false
              }
            ]
          }
        ],
        metadata: {
          created_by: 'john',
          created_on: '2024-10-22T11:24:04.388998Z',
          last_modified_by: 'john',
          last_modified_on: '2024-10-22T11:25:36.971764Z'
        }
      });
      // updateShiftLogs(response.data[0].shift_id);
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
      if (response && response.data && response.data.length > 0) {
        setShiftId(response.data[0].shift_id);
        setOperator(response.data[0].shift_operator.name);
        setShiftComment(response.data[0].comments ? response.data[0].comments : '');
        // setShiftData(response.data[0]);
        setShiftData(response.data[0]);
      }
    }
  };
  useEffect(() => {
    fetchSltCurrentShifts();
    updateShiftLogs();
    useKafkaData('slt-to-frontend-topic');
  }, []);

  const endNewShift = async () => {
    const shiftData = {
      shift_operator: operator,
      shift_start: shiftStart,
      shift_end: moment().utc().toISOString(),
      comments: `${shiftCommentValue}`
    };

    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.shiftEnd');
      setDisableButton(true);
      setDisplayMessageElement(true);
      setOperator('');
      setTimeout(() => {
        setDisplayMessageElement(false);
        setShiftComment('');
      }, 3000);
    }
  };

  const addShiftComments = async () => {
    if (shiftCommentValue === '') return;
    console.log('operatoroperator', operator);
    const shiftData = {
      shift_operator: operator,
      comments: `${shiftCommentValue}`
    };
    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.commentSubmit');
      setDisplayModalMessageElement(true);
      setShiftCommentID(response);
      setTimeout(() => {
        // setShiftComment('')
        setDisplayModalMessageElement(false);
      }, 3000);
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
    setDisplayModalMessageElement(true);
    setTimeout(() => {
      setDisplayModalMessageElement(false);
    }, 3000);
  };

  const handleViewImageClose = () => {
    setOpenViewImageModal(false);
  };
  const handleOpenImage = () => {
    console.log('wwwwwwwwwwwwwww');
    setOpenViewImageModal(true);
    fetchImage();
  };
  const handlesetOpenSummaryModal = () => {
    console.log('wwwwwwwwwwwwwww');
    setShiftComment('');
    setShiftCommentUpdate(false);
    setOpenSummaryModal(true);
    fetchImage();
  };

  const handleSummaryModalClose = () => {
    setOpenSummaryModal(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="20px"
      fontSize={18}
      color={InfoCardColorTypes.Success}
      message={t(successMessage)}
      testId="successStatusMsg"
    />
  );

  const renderModalMessageResponse = () => (
    <InfoCard
      minHeight="20px"
      fontSize={18}
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
    if (confirmation === 'YES' && shiftStatus === 'START') {
      setOpenDialog(false);
      startNewShift();
    } else if (confirmation === 'YES' && shiftStatus === 'END') {
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
        <Typography>{t('msg.confirmStartNewShiftMsg')}</Typography>
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
    // fetchSltCurrentShifts()

    console.log('event event');
    // setShiftData(null);
  };
  const endShiftAlertContent = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography>{t('msg.endNewShiftMsg')}</Typography>
        <Typography>{t('msg.confirmEndNewShiftMsg')}</Typography>
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

      <Paper sx={{ border: 1, margin: 2, marginTop: 0, marginBottom: 1 }}>
        <Grid container spacing={2} sx={{ padding: 2, paddingBottom: 0 }}>
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
              label="Add shift comments"
              testId="summaryButton"
              onClick={handlesetOpenSummaryModal}
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
        {dataDetails && dataDetails.shift_comment && dataDetails.shift_comment.length > 0 && (
          <Divider style={{ marginTop: '20px' }} />
        )}
        {dataDetails && dataDetails.shift_comment && dataDetails.shift_comment.length > 0 && (
          <Grid
            container
            sx={{ padding: 2, paddingTop: 0, maxHeight: '500px', overflowY: 'scroll' }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <div>
                <p
                  style={{
                    textDecoration: 'underline',
                    fontWeight: 900,
                    fontSize: '18px',
                    marginBottom: 0
                  }}
                >
                  {t('label.viewShiftComments')}
                </p>
              </div>
              {dataDetails &&
                dataDetails.shift_comment &&
                dataDetails.shift_comment.length > 0 &&
                dataDetails.shift_comment.map((shiftCommentItem, shiftCommentIndex) => (
                  <div key={shiftCommentItem.id}>
                    <Grid container justifyContent="start">
                      <Grid item xs={12} sm={12} md={4}>
                        <p>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>
                            {t('label.commentedAt')} :{' '}
                          </span>{' '}
                          <span>{toUTCDateTimeFormat(shiftCommentItem.created_on)}</span>
                        </p>
                      </Grid>
                      <Grid item xs={12} sm={12} md={3}>
                        <p
                          style={{
                            color: theme.palette.secondary.main,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                          aria-hidden="true"
                          data-testid="viewImages"
                          onClick={handleOpenImage}
                        >
                          {t('label.viewImages')}
                        </p>
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="start">
                      <Grid item xs={12} sm={12} md={12}>
                        {shiftCommentItem &&
                          shiftCommentItem.shift_comments &&
                          displayShiftComments(shiftCommentIndex, shiftCommentItem)}
                      </Grid>
                    </Grid>

                    {shiftCommentIndex !== dataDetails.shift_comment.length - 1 && (
                      <Divider style={{ marginTop: '15px' }} />
                    )}
                  </div>
                ))}
            </Grid>
          </Grid>
        )}
      </Paper>

      <Paper sx={{ border: 1, margin: 2, marginTop: 0 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
          {t('label.logSummary')}
        </p>
        <Divider />
        {dataDetails && dataDetails.shift_logs && dataDetails.shift_logs.length > 0 ? (
          <ShiftLogs
            isCurrentShift
            updateCommentsEvent={onUpdateCommentsEvent}
            shiftData={dataDetails}
          />
        ) : (
          <p style={{ padding: '10px' }}>{t('label.noLogsFound')}</p>
        )}
      </Paper>
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
        open={openSummaryModal}
        onClose={handleSummaryModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        {!isShiftCommentUpdate && (
          <DialogTitle>
            <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
              <Grid item xs={12} sm={12} md={4}>
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
              <Grid item xs={12} sm={12} md={5}>
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
                testId="operatorComment"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} marginTop={10}>
              <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                ariaDescription="Button for submitting comment"
                label="Add"
                testId="commentButton"
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
            testId="statusClose"
            label={t('label.close')}
            onClick={handleSummaryModalClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogStatus"
        fullWidth
        open={openDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {shiftStatus && shiftStatus === 'START' ? startShiftAlertTitle() : endShiftAlertTitle()}
        </DialogTitle>
        <DialogContent>
          {shiftStatus && shiftStatus === 'START'
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
                testId="historyButton"
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
                label="YES"
                onClick={() => newShiftConfirmation('YES')}
                testId="historyButton"
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
          {images && images.length > 0 && <ImageDisplay images={images} />}
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

export default CurrentActiveShift;
