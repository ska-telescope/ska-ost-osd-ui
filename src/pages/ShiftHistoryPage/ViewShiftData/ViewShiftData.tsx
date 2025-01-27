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
  Tooltip,
  Typography
} from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  InfoCard,
  InfoCardColorTypes,
  TextEntry
} from '@ska-telescope/ska-gui-components';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import ImageDisplayComponent from '../../../components/ImageDisplayComponent/ImageDisplayComponent';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import apiService from '../../../services/apis';
import { createShiftAnnotationPath } from '../../../utils/api_constants';
import DisplayShiftLogsComponent from '../../CurrentShiftPage/DisplayShiftLogsComponent/DisplayShiftLogsComponent';
import { toUTCDateTimeFormat, USE_LOCAL_DATA } from '../../../utils/constants';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/ShiftDataList';

const ViewShiftData = ({ data }) => {
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const [openViewImageModal, setOpenViewImageModal] = useState(false);

  const [dataDetails, setShiftAnnotationData] = useState(
    data && data.annotation ? data.annotation : []
  );
  const [shiftAnnotationValue, setShiftAnnotation] = useState('');
  const [shiftAnnotationID, setShiftAnnotationID] = useState(null);
  const [isShiftAnnotationUpdate, setShiftAnnotationUpdate] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);

  const [successMessage, setMessage] = useState('');
  const [displayModalMessageElement, setDisplayModalMessageElement] = useState(false);

  let id = 1;
  if (data && data.shift_logs) {
    data.shift_logs.map((row) => {
      row.id = id++;
      return row;
    });
  }

  const handleSummaryModalClose = () => {
    setOpenSummaryModal(false);
  };

  const renderModalMessageResponse = () => (
    <InfoCard
      minHeight="15px"
      fontSize={16}
      color={InfoCardColorTypes.Success}
      message={t(successMessage)}
      testId="successAnnotationStatusMsg"
    />
  );

  const useLocalData = () => {
    setShiftAnnotationData(SHIFT_DATA_LIST[0]['annotation']);
  };

  const fetchSltHistoryByID = async () => {
    if (USE_LOCAL_DATA) {
      useLocalData();
      return true;
    }
    const path = createShiftAnnotationPath(data.shift_id, 'get');
    const response = await apiService.getSltData(path);
    if (response.status === 200) {
      setShiftAnnotationData(response.data[0]);
    }
  };

  const onEditShiftAnnotation = (shiftAnnotationItem) => {
    setShiftAnnotationID(shiftAnnotationItem.id);
    setOpenSummaryModal(true);
    setShiftAnnotationUpdate(true);
    setShiftAnnotation(shiftAnnotationItem.annotation);
  };

  const displayShiftComments = (shiftCommentItem) => (
    <>
      <span data-testid="shiftCommentsHistory" style={{ fontWeight: 700, fontSize: '14px' }}>
        {t('label.comments')}:{' '}
      </span>{' '}
      <span>{shiftCommentItem.comment}</span>
    </>
  );

  const fetchImage = async (shiftCommentId) => {
    setImages([]);
    const path = `shift_comment/download_images/${shiftCommentId}`;
    const result = await apiService.getImage(path);
    if (result.status === 200) {
      setImages(result && result.data && result.data[0] ? result.data[0] : []);
    } else {
      setImages([{ isEmpty: true }]);
    }
  };

  const handleOpenImage = (shiftCommentId) => {
    setOpenViewImageModal(true);
    fetchImage(shiftCommentId);
  };

  const handleViewImageClose = () => {
    setOpenViewImageModal(false);
  };

  const displayShiftAnnotations = (shiftAnnotationItem, shiftAnnotationIndex) => (
    <div>
      {shiftAnnotationItem.annotation && (
        <span data-testid="shiftAnnotation" style={{ fontWeight: 700, fontSize: '14px' }}>
          {t('label.annotations')}:{' '}
        </span>
      )}
      <span>{shiftAnnotationItem.annotation}</span>
      {shiftAnnotationItem.annotation && (
        <Tooltip title="Edit the Annotation" placement="bottom-end">
          <DriveFileRenameOutlineIcon
            color="secondary"
            aria-label={t('ariaLabel.edit')}
            data-testid={`editShiftAnnotation${shiftAnnotationIndex}`}
            style={{
              cursor: 'pointer',
              position: 'relative',
              top: '7px'
            }}
            onClick={() => onEditShiftAnnotation(shiftAnnotationItem)}
          />
        </Tooltip>
      )}
    </div>
  );

  const addShiftAnnotations = async () => {
    if (shiftAnnotationValue === '') return;
    const shiftData = {
      user_name: data.shift_operator,
      annotation: `${shiftAnnotationValue}`,
      shift_id: data.shift_id
    };
    if (isShiftAnnotationUpdate) {
      const updatePath = createShiftAnnotationPath(shiftAnnotationID, 'id');
      const response = await apiService.putShiftData(updatePath, shiftData);
      if (response.status === 200) {
        setMessage('msg.annotationSubmit');
        setDisplayModalMessageElement(true);
        setShiftAnnotationID(response.data[0].id);
        fetchSltHistoryByID();
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    } else {
      const addPath = createShiftAnnotationPath(shiftAnnotationID, 'basePath');
      const response = await apiService.postShiftData(addPath, shiftData);
      if (response.status === 200) {
        setMessage('msg.annotationSubmit');
        setDisplayModalMessageElement(true);
        setShiftAnnotationID(response.data[0].id);
        fetchSltHistoryByID();
        setTimeout(() => {
          setDisplayModalMessageElement(false);
        }, 3000);
      }
    }
  };

  const setShiftAnnotationValue = (event) => {
    setShiftAnnotation(event);
  };

  const handleSetOpenSummaryModal = () => {
    setShiftAnnotationID(null);
    setShiftAnnotation('');
    setShiftAnnotationUpdate(false);
    setOpenSummaryModal(true);
  };

  useEffect(() => {
    fetchSltHistoryByID();
  }, []);

  return (
    <Box sx={{ paddingBottom: 2 }}>
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
          {images ? (
            <ImageDisplayComponent images={images} />
          ) : (
            <p data-testid="noImageMsg">{t('label.noImageFound')}</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            size={ButtonSizeTypes.Small}
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="shiftAnnotationModalImageClose"
            label={t('label.close')}
            onClick={handleViewImageClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
      <Grid container sx={{ padding: 2 }} justifyContent="left">
        <Grid item xs={12} sm={12} md={3}>
          <span id="operatorName" style={{ fontWeight: 'bold', alignItems: 'center' }}>
            {t('label.operatorName')}{' '}
          </span>
          <span> : {data.shift_operator}</span>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <span id="shiftStart" style={{ fontWeight: 'bold' }}>
            {t('label.shiftStartedAt')}{' '}
          </span>
          <span>: {data.shift_start ? toUTCDateTimeFormat(data.shift_start) : 'NA'}</span>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <span id="shiftEnd" style={{ fontWeight: 'bold', alignItems: 'center' }}>
            {t('label.shiftEndsAt')}{' '}
          </span>
          <span>: {data.shift_end ? toUTCDateTimeFormat(data.shift_end) : 'Active shift'}</span>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Button
            size={ButtonSizeTypes.Small}
            icon={<AddIcon />}
            ariaDescription="Button for submitting annotation"
            label={t('label.addShiftAnnotations')}
            testId="addShiftAnnotations"
            onClick={handleSetOpenSummaryModal}
            variant={ButtonVariantTypes.Contained}
            color={ButtonColorTypes.Secondary}
          />
        </Grid>
      </Grid>
      <hr />
      <Grid container sx={{ padding: 2 }} justifyContent="left">
        <Grid item xs={12} sm={12} md={6}>
          <Grid item xs={12} sm={12} md={12}>
            <Grid
              container
              sx={{ padding: 2, paddingTop: 0, maxHeight: '500px', overflowY: 'scroll' }}
            >
              <Grid item xs={12} sm={12} md={12}>
                <div>
                  <p
                    data-testid="viewShiftCommentsHistory"
                    style={{
                      fontWeight: 900,
                      fontSize: '18px',
                      marginBottom: 0
                    }}
                  >
                    {t('label.viewShiftComments')}
                  </p>
                </div>
                {data &&
                  data.comments &&
                  data.comments.length > 0 &&
                  data.comments.map((shiftCommentItem, shiftCommentIndex) => (
                    <div key={shiftCommentItem.id}>
                      <Grid
                        container
                        justifyContent="start"
                        data-testid="viewShiftCommentsHistoryData"
                      >
                        <Grid item xs={12} sm={12} md={9}>
                          <p data-testid="commentedAtHistory">
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>
                              {t('label.commentedAt')} :
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
                            data-testid={`viewShiftHistoryImagesHistory${shiftCommentIndex}`}
                            onClick={() => handleOpenImage(shiftCommentItem.id)}
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

                      {shiftCommentIndex !== data.comments.length - 1 && (
                        <Divider style={{ marginTop: '15px' }} />
                      )}
                    </div>
                  ))}
                {data && data.comments && data.comments.length === 0 && (
                  <p>{t('label.noCommentsFound')}</p>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <Grid
            container
            sx={{ padding: 2, paddingTop: 0, maxHeight: '500px', overflowY: 'scroll' }}
          >
            <Grid item xs={12} sm={12} md={12}>
              <div>
                {dataDetails && (
                  <p
                    data-testid="viewShiftAnnotations"
                    style={{
                      fontWeight: 900,
                      fontSize: '18px',
                      marginBottom: 0
                    }}
                  >
                    {t('label.viewShiftAnnotations')}
                  </p>
                )}
              </div>
              {dataDetails &&
                dataDetails.map((shiftAnnotationItem, shiftAnnotationIndex) => (
                  <div key={shiftAnnotationItem.id}>
                    <Grid container justifyContent="start">
                      <Grid item xs={12} sm={12} md={4}>
                        <p data-testid="AnnotatedAt">
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>
                            {t('label.commentedAt')} :{' '}
                          </span>{' '}
                          <span>
                            {shiftAnnotationItem &&
                            shiftAnnotationItem.metadata &&
                            shiftAnnotationItem.metadata.created_on
                              ? toUTCDateTimeFormat(shiftAnnotationItem.metadata.created_on)
                              : 'NA'}
                          </span>
                        </p>
                      </Grid>
                    </Grid>
                    <Grid container justifyContent="start">
                      <Grid item xs={12} sm={12} md={12}>
                        {shiftAnnotationItem &&
                          shiftAnnotationItem.annotation &&
                          displayShiftAnnotations(shiftAnnotationItem, shiftAnnotationIndex)}
                      </Grid>
                    </Grid>

                    {shiftAnnotationIndex !== dataDetails.length - 1 && (
                      <Divider style={{ marginTop: '15px' }} />
                    )}
                  </div>
                ))}
              {dataDetails && dataDetails.length === 0 && <p>{t('label.noAnnotationsFound')}</p>}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="addShiftAnnotationModal"
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
        {!isShiftAnnotationUpdate && (
          <DialogTitle>
            <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
              <Grid item xs={12} sm={12} md={4} data-testid="addShiftAnnotationTitle">
                {t('label.addAnnotations')}
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
        {isShiftAnnotationUpdate && (
          <DialogTitle>
            <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
              <Grid item xs={12} sm={12} md={5} data-testid="addShiftAnnotationTitle">
                {t('label.updateAnnotations')}
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
              {!isShiftAnnotationUpdate && (
                <p
                  data-testid="addShiftAnnotation"
                  style={{
                    fontWeight: 900,
                    fontSize: '18px',
                    marginBottom: 0
                  }}
                >
                  {t('label.addShiftAnnotations')}
                </p>
              )}
              {isShiftAnnotationUpdate && (
                <p
                  data-testid="addShiftAnnotation"
                  style={{
                    fontWeight: 900,
                    fontSize: '18px',
                    marginBottom: 0
                  }}
                >
                  {t('label.updateShiftAnnotations')}
                </p>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="left">
            <Grid item xs={12} sm={12} md={8}>
              <TextEntry
                setValue={setShiftAnnotationValue}
                rows={3}
                label="Please enter shift annotations"
                value={shiftAnnotationValue}
                testId="operatorShiftAnnotation"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} marginTop={10}>
              <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                ariaDescription="Button for submitting annotation"
                label={t('label.add')}
                testId="shiftAnnotationButton"
                onClick={addShiftAnnotations}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            size={ButtonSizeTypes.Small}
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="shiftAnnotationModalClose"
            label={t('label.close')}
            onClick={handleSummaryModalClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>

      <Grid container sx={{ padding: 2, paddingLeft: 0 }} spacing={2} />
      <Paper sx={{ border: '1px solid darkgrey' }}>
        <Grid container spacing={2} justifyContent="left">
          <Grid item xs={12} sm={12} md={12}>
            <Paper sx={{ padding: '10px' }}>
              <Typography
                data-testid="viewLogDataIDLabel"
                style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}
              >
                {t('label.logSummary')}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={12}>
            {data.shift_logs ? (
              <DisplayShiftLogsComponent
                isCurrentShift={false}
                shiftData={data}
                updateCommentsEvent={undefined}
              />
            ) : (
              <div style={{ margin: '15px', width: '50%' }}>
                <InfoCard
                  minHeight="15px"
                  fontSize={16}
                  color={InfoCardColorTypes.Info}
                  message={t('label.noLogsFound')}
                  testId="successStatusMsg"
                />
              </div>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewShiftData;
