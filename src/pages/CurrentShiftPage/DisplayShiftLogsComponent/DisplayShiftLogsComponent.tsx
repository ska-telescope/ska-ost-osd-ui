/* eslint-disable no-console */

import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Tooltip
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  FileUpload,
  InfoCard,
  InfoCardColorTypes,
  TextEntry
} from '@ska-telescope/ska-gui-components';
import AddIcon from '@mui/icons-material/Add';
import { EBRequestResponseStatus, toUTCDateTimeFormat } from '../../../utils/constants';
import apiService from '../../../services/apis';
import ImageDisplayComponent from '../../../components/ImageDisplayComponent';

const RequestResponseDisplay = ({ responseArray }) => {
  const { t } = useTranslation('translations');
  const [openPannel] = useState(false);
  let id = 1;
  if (responseArray && responseArray.length > 0) {
    responseArray.map((row) => {
      row.id = id++;
      return row;
    });
  }
  return (
    <div>
      <span style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '16px' }}>
        {t('label.ebObservations')}
      </span>
      {responseArray &&
        responseArray.length > 0 &&
        responseArray.map((dataItem) => (
          <div key={dataItem.id}>
            <Accordion defaultExpanded={openPannel}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <span>{dataItem.request ? dataItem.request : ''} </span>

                <Chip
                  size="small"
                  label={dataItem.status ? dataItem.status : ''}
                  style={{ marginLeft: '10px' }}
                  color={
                    dataItem.status && dataItem.status === EBRequestResponseStatus.OK
                      ? 'success'
                      : 'error'
                  }
                />
              </AccordionSummary>
              <AccordionDetails>
                <Grid container justifyContent="start">
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography>
                      {t('label.requestSentAt')}{' '}
                      <b>
                        {dataItem.request_sent_at
                          ? toUTCDateTimeFormat(dataItem.request_sent_at)
                          : 'NA'}
                      </b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    {dataItem.response_received_at && (
                      <Typography>
                        {t('label.responseReceivedAt')}{' '}
                        <b>{toUTCDateTimeFormat(dataItem.response_received_at)}</b>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Grid container justifyContent="start" style={{ paddingTop: '10px' }}>
                  <Grid item xs={12} sm={12} md={12}>
                    <Typography style={{ textDecoration: 'underline', fontSize: '15px' }}>
                      {' '}
                      <b>{t('label.details')}</b>
                    </Typography>
                    <pre>
                      {dataItem.status && dataItem.status === EBRequestResponseStatus.OK
                        ? dataItem.response && dataItem.response.result && dataItem.response.result
                        : dataItem.error && dataItem.error.detail && dataItem.error.detail}
                    </pre>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>
        ))}
    </div>
  );
};

const DisplayShiftLogsComponent = ({ shiftData, updateCommentsEvent, isCurrentShift }) => {
  const { t } = useTranslation('translations');
  const [commentValue, setComment] = useState('');
  const [updateCommentValue, setUpdateComment] = useState('');
  const logDataDetails = shiftData.shift_logs;
  const [openModal, setOpenModal] = useState(false);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [shiftLogCommentID, setShiftLogCommentID] = useState(0);
  const [isUpdateEnable, setIsUpdateEnable] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [selectedLogDetails, setSelectedLogDetails] = useState('');
  const [logCommentsIndex, setLogCommentsIndex] = useState(0);
  console.log('shiftDatashiftData', shiftData);
  let id = 1;
  if (logDataDetails && logDataDetails.length > 0) {
    logDataDetails.map((row) => {
      row.id = id++;
      if (!row.newLogComment) {
        row.newLogComment = '';
      }
      return row;
    });
  }
  const postLogImage = async (file) => {
    if (shiftLogCommentID && shiftLogCommentID > 0) {
      const path = `shift_log_comments/upload_image/${shiftLogCommentID}`;
      const formData = new FormData();
      formData.append('files', file);
      const config = {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data'
        }
      };
      const response = await apiService.updateImage(path, formData, config);
      if (response.status === 200) {
        setMessageType('addLogImage');
        setMessage('msg.imageUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      }
    } else {
      const path = `shift_log_comments/upload_image?shift_id=${shiftData.shift_id}&shift_operator=${shiftData.shift_operator}&eb_id=${selectedLogDetails.info.eb_id}`;
      const formData = new FormData();
      formData.append('file', file);
      const config = {
        headers: {
          accept: 'application/json',
          'content-type': 'multipart/form-data'
        }
      };
      const response = await apiService.addImage(path, formData, config);
      if (response.status === 200) {
        setMessageType('addLogImage');
        setMessage('msg.imageUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      }
    }
  };

  const addLogComments = async (logIndex, data) => {
    console.log('data', data);
    if (commentValue === '') return;
    console.log('shiftData', shiftData);
    const addCommentRequestBody = {
      log_comment: `${commentValue}`,
      operator_name: shiftData.shift_operator,
      shift_id: shiftData.shift_id,
      eb_id: data.info.eb_id
    };
    console.log('commentcomment', addCommentRequestBody);
    const path = `shift_log_comments/create`;
    setLogCommentsIndex(logIndex);
    const response = await apiService.postShiftData(path, addCommentRequestBody);
    if (response.status === 200) {
      updateCommentsEvent();
      console.log('qqqqqqssssssssssssssssssss', response);
      setShiftLogCommentID(response.data && response.data.length > 0 ? response.data[0].id : '');
      setDisplayMessageElement(true);
      setMessageType('addLogComments');
      setMessage('msg.commentSubmit');
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
    }
  };
  const updateLogComments = async (logIndex, commentItem, commentIndex) => {
    console.log('commentItemcommentItem', commentItem, commentIndex);
    if (updateCommentValue === '') return;
    const updateCommentPayload = {
      log_comment: `${updateCommentValue}`,
      operator_name: shiftData.shift_operator
    };
    const path = `shift_log_comments/update/${commentItem.id}`;
    setLogCommentsIndex(logIndex);
    const response = await apiService.updateLogComments(path, updateCommentPayload);
    if (response.status === 200) {
      updateCommentsEvent();
      setShiftLogCommentID(response.data && response.data.length > 0 ? response.data[0].id : '');
      setDisplayMessageElement(true);
      setMessageType('updateLogComments');
      setMessage('msg.commentSubmit');
      // shiftData["shift_logs"][logIndex]["comments"][commentIndex]["isEdit"]=false;
      setTimeout(() => {
        setDisplayMessageElement(false);
        setIsUpdateEnable(false);
      }, 3000);
    }
  };

  const handleInputChange = (index, event) => {
    console.log('handleInputChange', index, event);
    setLogCommentsIndex(index);
    logDataDetails[index].newLogComment = event; // Update the specific input value
    setComment(event); // Set the new state
  };
  const handleUpdateInputChange = (event) => {
    // logData[logIndex].comments[commentIndex].logcomments = commentItem;
    setUpdateComment(event); // Set the new state
    console.log(updateCommentValue);
  };

  const onEditComment = (logIndex, commentIndex, commentItem) => {
    setIsUpdateEnable(true);
    setShiftLogCommentID(commentItem.id);
    setLogCommentsIndex(logIndex);
    setUpdateComment(commentItem.log_comment);
    shiftData.shift_logs[logIndex].comments[commentIndex].isEdit = true;
    setComment(shiftData.shift_logs[logIndex].comments[commentIndex].logcomments);
    console.log('shiftLogCommentIDshiftLogCommentID', shiftLogCommentID);
    // setLogComment(shiftData["shift_logs"][logIndex]["comments"][commentIndex])
  };

  const displayLogComment = (logIndex, commentIndex, logData, commentItem) => (
    <div>
      <span style={{ fontWeight: 700, fontSize: '14px' }}> {t('label.comments')}: </span>
      <span>{commentItem.log_comment}</span>
      {isCurrentShift && (
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
            onClick={() => onEditComment(logIndex, commentIndex, commentItem)}
          />
        </Tooltip>
      )}
    </div>
  );

  const displayUpdateLogComment = (logIndex, commentItem, commentIndex) => (
    <>
      <Grid container justifyContent="start">
        <Grid item xs={12} sm={12} md={9}>
          <TextEntry
            rows={1}
            setValue={(event) => handleUpdateInputChange(event)}
            label={t('label.logCommentLabel')}
            value={shiftLogCommentID === commentItem.id ? updateCommentValue : ''}
            testId={`logComment${commentIndex}`}
          />
        </Grid>
        <Grid marginTop={4} marginLeft={1} item xs={12} sm={12} md={2}>
          <Button
            icon={<AddIcon />}
            ariaDescription="Button for submitting comment"
            label="Update"
            testId="commentButton"
            onClick={() => updateLogComments(logIndex, commentItem, commentIndex)}
            size={ButtonSizeTypes.Small}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Secondary}
          />
        </Grid>
      </Grid>

      <Grid container justifyContent="start">
        <Grid item xs={12} sm={12} md={12} style={{ flex: 'none', marginTop: '10px' }}>
          <FileUpload
            chooseColor={ButtonColorTypes.Secondary}
            chooseVariant={ButtonVariantTypes.Contained}
            clearLabel="Remove"
            clearVariant={ButtonVariantTypes.Outlined}
            buttonSize={ButtonSizeTypes.Small}
            testId={`updateLlogImage${logIndex}`}
            uploadFunction={postLogImage}
          />
        </Grid>
      </Grid>
    </>
  );
  const fetchImage = async (commentId) => {
    console.log('shiftLogCommentIDshiftLogCommentID', commentId);
    const path = `shift_log_comments/download_images/${commentId}`;
    const result = await apiService.getImage(path);
    if (result.status === 200) {
      setImages(result && result.data && result.data[0] ? result.data[0] : []);
    } else {
      setImages([{ isEmpty: true }]);
    }
  };
  const handleOpenImage = (commentId) => {
    setOpenModal(true);
    fetchImage(commentId);
  };

  const setLogDetails = (logDetails) => {
    console.log('qqqqqqqqqqqqqq', logDetails);
    setSelectedLogDetails(logDetails);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(message)}
      testId="successStatusMsg"
    />
  );
  return (
    <div>
      {logDataDetails &&
        logDataDetails.length > 0 &&
        logDataDetails.map((data, logIndex) => (
          <div key={data.id}>
            <Paper style={{ padding: '10px', paddingTop: 0, paddingBottom: 0 }}>
              <Grid container justifyContent="start">
                <Grid item xs={12} sm={12} md={6.5}>
                  <Grid container justifyContent="start" style={{ paddingTop: '10px' }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <Chip
                        size="small"
                        label={`Source:${data.source ? data.source : ''}`}
                        color="info"
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                      <span>
                        {t('label.dateTime')}{' '}
                        <b>{data.log_time ? toUTCDateTimeFormat(data.log_time) : 'NA'}</b>
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={1} />
                    <Grid item xs={12} sm={12} md={2}>
                      <Chip
                        size="small"
                        label={`${data.info && data.info.sbi_status ? data.info.sbi_status.toUpperCase() : 'NA'}`}
                        color={`${data.info && data.info.sbi_status && data.info.sbi_status === 'failed' ? 'error' : 'success'}`}
                      />
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12}>
                      <p>
                        {t('label.ebID')} <b>{data.info.eb_id}</b>
                      </p>
                      <p>
                        {t('label.sbiID')} <b>{data.info.sbi_ref}</b> {t('label.isStatus')}{' '}
                        <b>
                          {data.info && data.info.sbi_status
                            ? data.info.sbi_status.toUpperCase()
                            : 'NA'}
                        </b>
                      </p>
                    </Grid>
                  </Grid>
                  <Grid container justifyContent="start">
                    <Grid item xs={12} sm={12} md={12}>
                      <RequestResponseDisplay
                        responseArray={
                          data.info && data.info.request_responses
                            ? data.info.request_responses
                            : []
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.12)', paddingLeft: '10px' }}
                  item
                  xs={12}
                  sm={12}
                  md={5.5}
                >
                  {isCurrentShift && (
                    <>
                      <Grid container justifyContent="start" style={{ position: 'relative' }}>
                        <Grid item xs={12} sm={12} md={4}>
                          <p
                            style={{
                              textDecoration: 'underline',
                              fontWeight: 900,
                              fontSize: '18px'
                            }}
                          >
                            {t('label.addLogComments')}
                          </p>
                        </Grid>
                        <Grid item xs={12} sm={12} md={8}>
                          <div style={{ position: 'absolute', zIndex: 2, top: '5px' }}>
                            {displayMessageElement &&
                            messageType === 'addLogComments' &&
                            logIndex === logCommentsIndex
                              ? renderMessageResponse()
                              : ''}
                            {displayMessageElement &&
                            messageType === 'addLogImage' &&
                            logIndex === logCommentsIndex
                              ? renderMessageResponse()
                              : ''}
                          </div>
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="start">
                        <Grid item xs={12} sm={12} md={10}>
                          <TextEntry
                            rows={1}
                            setValue={(event) => handleInputChange(logIndex, event)}
                            label={t('label.logCommentLabel')}
                            value={logCommentsIndex === logIndex ? commentValue : ''}
                            testId={`logComment${logIndex}`}
                          />
                        </Grid>
                        <Grid item marginTop={4} marginLeft={1} xs={12} sm={12} md={1}>
                          <Button
                            icon={<AddIcon />}
                            ariaDescription="Button for submitting comment"
                            label={t('label.add')}
                            disabled={
                              logCommentsIndex === logIndex &&
                              !(commentValue && commentValue !== '')
                            }
                            testId="commentButton"
                            onClick={() => addLogComments(logIndex, data)}
                            size={ButtonSizeTypes.Small}
                            variant={ButtonVariantTypes.Contained}
                            color={ButtonColorTypes.Secondary}
                          />
                        </Grid>
                      </Grid>
                      <Grid container justifyContent="center">
                        <Grid item xs={12} sm={12} md={12}>
                          <div>
                            <p
                              style={{
                                textDecoration: 'underline',
                                fontWeight: 900,
                                fontSize: '18px'
                              }}
                            >
                              {t('label.addImages')}
                            </p>
                          </div>
                          <div
                            aria-hidden="true"
                            style={{ float: 'left' }}
                            onKeyDown={() => setLogDetails(data)}
                            onClick={() => setLogDetails(data)}
                          >
                            <FileUpload
                              chooseColor={ButtonColorTypes.Secondary}
                              chooseVariant={ButtonVariantTypes.Contained}
                              clearLabel="Remove"
                              clearVariant={ButtonVariantTypes.Outlined}
                              buttonSize={ButtonSizeTypes.Small}
                              testId={`logImage${logIndex}`}
                              uploadFunction={postLogImage}
                            />
                          </div>
                        </Grid>
                      </Grid>
                      <Divider style={{ marginTop: '15px' }} />
                    </>
                  )}

                  <Box
                    data-testid="availableData"
                    sx={{
                      marginTop: 2,
                      maxHeight: '500px',
                      paddingRight: '10px',
                      overflowY: 'scroll'
                    }}
                  >
                    <Grid container justifyContent="start" style={{ position: 'relative' }}>
                      <Grid item xs={12} sm={12} md={5}>
                        <p
                          style={{
                            textDecoration: 'underline',
                            fontWeight: 900,
                            fontSize: '18px'
                          }}
                        >
                          <b> {t('label.viewLogComments')}</b>
                        </p>
                      </Grid>
                      <Grid item xs={12} sm={12} md={7}>
                        <div style={{ position: 'absolute', zIndex: 2 }}>
                          {displayMessageElement &&
                          messageType === 'updateLogComments' &&
                          logIndex === logCommentsIndex
                            ? renderMessageResponse()
                            : ''}
                        </div>
                      </Grid>
                    </Grid>

                    <Divider />

                    {data &&
                      data.comments &&
                      data.comments.length > 0 &&
                      data.comments.map((commentItem, commentIndex) => (
                        <div key={commentItem.id}>
                          <Grid container justifyContent="start">
                            <Grid item xs={12} sm={12} md={6}>
                              <p>
                                <span style={{ fontWeight: 700, fontSize: '14px' }}>
                                  {t('label.dateTime')}:{' '}
                                </span>
                                <span>
                                  {data && data.metadata && data.metadata.created_on
                                    ? toUTCDateTimeFormat(data.metadata.created_on)
                                    : 'NA'}
                                </span>
                              </p>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6}>
                              <Chip
                                size="small"
                                color="info"
                                style={{
                                  cursor: 'pointer',
                                  marginTop: '12px'
                                }}
                                data-testid="viewSHiftLogCommentsImages"
                                onClick={() => handleOpenImage(commentItem.id)}
                                label={`${t('label.viewImages')} (${commentItem.image ? commentItem.image.length : 0})`}
                                variant="outlined"
                              />
                            </Grid>
                          </Grid>

                          <div>
                            {isUpdateEnable &&
                            isCurrentShift &&
                            shiftLogCommentID === commentItem.id &&
                            logIndex === logCommentsIndex
                              ? displayUpdateLogComment(logIndex, commentItem, commentIndex)
                              : displayLogComment(
                                  logIndex,
                                  commentIndex,
                                  logDataDetails,
                                  commentItem
                                )}
                          </div>
                          <Divider style={{ marginTop: '15px' }} />
                        </div>
                      ))}
                    {data && !data.comments && <p>{t('label.nologComments')}</p>}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            <Divider />
          </div>
        ))}
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
          {images && images.length > 0 ? (
            <ImageDisplayComponent images={images} />
          ) : (
            <p>{t('label.noImageFound')}</p>
          )}
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
    </div>
  );
};

export default DisplayShiftLogsComponent;
