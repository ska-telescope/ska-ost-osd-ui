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
import { config, createShiftLogCommentPath } from '../../../utils/api_constants';
import apiService from '../../../services/apis';
import ImageDisplayComponent from '../../../components/ImageDisplayComponent/ImageDisplayComponent';

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
                      ? 'secondary'
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
  const [openModal, setOpenModal] = useState(false);

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [shiftLogCommentID, setShiftLogCommentID] = useState('');
  const [shiftNewLogCommentID, setShiftNewLogCommentID] = useState('');
  const [isUpdateEnable, setIsUpdateEnable] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [selectedLogDetails, setSelectedLogDetails] = useState(null);
  const [logCommentsIndex, setLogCommentsIndex] = useState(0);

  let id = 1;
  if (shiftData && shiftData.shift_logs.length > 0) {
    shiftData.shift_logs.map((row) => {
      row.id = id++;
      if (!row.newLogComment) {
        row.newLogComment = '';
      }
      return row;
    });
  }
  const postLogImage = async (file) => {
    if (shiftNewLogCommentID && commentValue !== '') {
      const path = createShiftLogCommentPath(shiftNewLogCommentID, 'image');
      const formData = new FormData();
      formData.append('files', file);
      const response = await apiService.updateImage(path, formData, config);
      if (response.status === 200) {
        setMessageType('addLogImage');
        setMessage('msg.imageUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      } else {
        setMessage('msg.imageNotUpload');
        setDisplayMessageElement(true);
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      }
    } else if (shiftLogCommentID) {
      const path = createShiftLogCommentPath(shiftLogCommentID, 'image');
      const formData = new FormData();
      formData.append('files', file);
      const response = await apiService.updateImage(path, formData, config);
      if (response.status === 200) {
        setMessageType('addLogImage');
        setMessage('msg.imageUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      } else {
        setMessageType('addLogImage');
        setMessage('msg.imageNotUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
        }, 3000);
      }
    } else {
      const path = `shift_log_comments/upload_image?shift_id=${shiftData.shift_id}&shift_operator=${shiftData.shift_operator}&eb_id=${selectedLogDetails && selectedLogDetails.info && selectedLogDetails.info.eb_id ? selectedLogDetails.info.eb_id : ''}`;
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiService.addImage(path, formData, config);
      if (response.status === 200) {
        setMessageType('addLogImage');
        setMessage('msg.imageUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
          setIsUpdateEnable(false);
        }, 3000);
      } else {
        setMessageType('addLogImage');
        setMessage('msg.imageNotUpload');
        setDisplayMessageElement(true);
        updateCommentsEvent();
        setTimeout(() => {
          setDisplayMessageElement(false);
          setIsUpdateEnable(false);
        }, 3000);
      }
    }
  };

  const addLogComments = async (logIndex, data) => {
    if (commentValue === '') return;
    const addCommentRequestBody = {
      log_comment: `${commentValue}`,
      operator_name: shiftData.shift_operator,
      shift_id: shiftData.shift_id,
      eb_id: data.info.eb_id
    };
    const path = createShiftLogCommentPath(shiftLogCommentID, 'basePath');
    setLogCommentsIndex(logIndex);
    const response = await apiService.postShiftData(path, addCommentRequestBody);
    if (response.status === 200) {
      updateCommentsEvent();
      setShiftNewLogCommentID(response.data && response.data.length > 0 ? response.data[0].id : '');
      setDisplayMessageElement(true);
      setMessageType('addLogComments');
      setMessage('msg.commentSubmit');
      setTimeout(() => {
        setDisplayMessageElement(false);
      }, 3000);
    }
  };
  const updateLogComments = async (logIndex, commentItem) => {
    if (updateCommentValue === '') return;
    const updateCommentPayload = {
      log_comment: `${updateCommentValue}`,
      operator_name: shiftData.shift_operator
    };
    const path = createShiftLogCommentPath(commentItem.id, 'id');
    setLogCommentsIndex(logIndex);
    const response = await apiService.updateLogComments(path, updateCommentPayload);
    if (response.status === 200) {
      updateCommentsEvent();
      setShiftNewLogCommentID('');
      setShiftLogCommentID(response.data && response.data.length > 0 ? response.data[0].id : '');
      setDisplayMessageElement(true);
      setMessageType('updateLogComments');
      setMessage('msg.commentSubmit');
      setTimeout(() => {
        setDisplayMessageElement(false);
        setIsUpdateEnable(false);
      }, 3000);
    }
  };

  const handleInputChange = (index, event) => {
    setLogCommentsIndex(index);
    setUpdateComment('');
    setIsUpdateEnable(false);
    setComment(event);
  };
  const handleUpdateInputChange = (event) => {
    setUpdateComment(event);
  };

  const onEditComment = (logIndex, commentIndex, commentItem) => {
    setIsUpdateEnable(true);
    setComment('');
    setShiftNewLogCommentID('');
    setShiftLogCommentID(commentItem.id);
    setLogCommentsIndex(logIndex);
    setUpdateComment(commentItem.log_comment);
  };

  const displayLogComment = (logIndex, commentIndex, commentItem) => (
    <div>
      {commentItem.log_comment && (
        <span style={{ fontWeight: 700, fontSize: '14px' }}> {t('label.comments')}: </span>
      )}
      <span>{commentItem.log_comment}</span>
      {isCurrentShift && commentItem.log_comment && (
        <Tooltip title="Edit the log comment" placement="bottom-end">
          <DriveFileRenameOutlineIcon
            color="secondary"
            aria-label={t('ariaLabel.edit')}
            data-testid={`editShiftLogs${logIndex}${commentIndex}`}
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

  const setLogDetails = (logDetails) => {
    setShiftNewLogCommentID('');
    setSelectedLogDetails(logDetails);
  };

  const displayUpdateLogComment = (logIndex, commentItem, commentIndex, data) => (
    <Grid container justifyContent="start">
      <Grid item xs={12} sm={12} md={9}>
        <TextEntry
          rows={1}
          setValue={(event) => handleUpdateInputChange(event)}
          label={t('label.logCommentLabel')}
          value={updateCommentValue || ''}
          testId={`logComment${commentIndex}`}
        />
      </Grid>
      <Grid marginTop={4} marginLeft={1} item xs={12} sm={12} md={2}>
        <Button
          icon={<AddIcon />}
          ariaDescription="Button for submitting comment"
          label="Update"
          testId={`commentButtonUpdate${logIndex}`}
          onClick={() => updateLogComments(logIndex, commentItem)}
          size={ButtonSizeTypes.Small}
          variant={ButtonVariantTypes.Contained}
          color={ButtonColorTypes.Secondary}
        />
      </Grid>
      <Grid container justifyContent="start">
        <Grid item xs={12} sm={12} md={12}>
          <div
            onKeyDown={() => setLogDetails(data)}
            onClick={() => setLogDetails(data)}
            aria-hidden="true"
            style={{ float: 'left', marginTop: '10px' }}
          >
            <FileUpload
              chooseColor={ButtonColorTypes.Secondary}
              chooseVariant={ButtonVariantTypes.Contained}
              clearLabel="Remove"
              clearVariant={ButtonVariantTypes.Outlined}
              buttonSize={ButtonSizeTypes.Small}
              testId="logCommentImage"
              uploadFunction={postLogImage}
            />
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
  const fetchImage = async (commentId) => {
    setImages([]);
    const path = createShiftLogCommentPath(commentId, 'imageDownload');
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

  const setLogDetailsNew = (logDetails) => {
    setShiftLogCommentID('');
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
      {shiftData &&
        shiftData.shift_logs &&
        shiftData.shift_logs.length > 0 &&
        shiftData.shift_logs.map((data, logIndex) => (
          <div key={data.id}>
            <Paper
              data-testid="shiftLogDisplay"
              style={{ padding: '10px', paddingTop: 0, paddingBottom: 0 }}
            >
              <Grid container justifyContent="start">
                <Grid item xs={12} sm={12} md={6.5}>
                  <Grid container justifyContent="start" style={{ paddingTop: '10px' }}>
                    <Grid item xs={12} sm={12} md={3}>
                      <Chip
                        size="small"
                        label={`Source:${data.source ? data.source : ''}`}
                        color="secondary"
                        variant="outlined"
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
                        color={`${data.info && data.info.sbi_status && data.info.sbi_status === 'Failed' ? 'error' : 'success'}`}
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
                    <span
                      style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '16px' }}
                    >
                      {t('label.ebObservations')}
                    </span>
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
                            logIndex === logCommentsIndex &&
                            !isUpdateEnable
                              ? renderMessageResponse()
                              : ''}
                            {displayMessageElement &&
                            messageType === 'addLogImage' &&
                            logIndex === logCommentsIndex &&
                            !isUpdateEnable
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
                            testId={`commentButtonSave${logIndex}`}
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
                            onKeyDown={() => setLogDetailsNew(data)}
                            onClick={() => setLogDetailsNew(data)}
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
                  {data && data.comments && data.comments.length > 0 && (
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
                          <div style={{ position: 'absolute', zIndex: 2, top: '5px' }}>
                            {displayMessageElement &&
                            messageType === 'updateLogComments' &&
                            logIndex === logCommentsIndex &&
                            isUpdateEnable
                              ? renderMessageResponse()
                              : ''}
                            {displayMessageElement &&
                            messageType === 'addLogImage' &&
                            isUpdateEnable &&
                            logIndex === logCommentsIndex
                              ? renderMessageResponse()
                              : ''}
                          </div>
                        </Grid>
                        <Divider />
                      </Grid>

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
                                    {commentItem &&
                                    commentItem.metadata &&
                                    commentItem.metadata.created_on
                                      ? toUTCDateTimeFormat(commentItem.metadata.created_on)
                                      : 'NA'}
                                  </span>
                                </p>
                              </Grid>
                              <Grid item xs={12} sm={12} md={3} />
                              <Grid item xs={12} sm={12} md={3}>
                                <Chip
                                  size="small"
                                  color="secondary"
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
                                ? displayUpdateLogComment(logIndex, commentItem, commentIndex, data)
                                : displayLogComment(logIndex, commentIndex, commentItem)}
                            </div>
                            <Divider style={{ marginTop: '15px' }} />
                          </div>
                        ))}
                    </Box>
                  )}
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
