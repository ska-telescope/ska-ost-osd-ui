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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import apiService from '../../../services/apis';
import ImageDisplayComponent from '../../../components/ImageDisplayComponent';
import DisplayShiftLogsComponent from '../../CurrentShiftPage/DisplayShiftLogsComponent/DisplayShiftLogsComponent';
import { toUTCDateTimeFormat } from '../../../utils/constants';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';
// import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const ViewShiftData = ({ data }) => {
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const [value, setValue] = useState(data && data.annotations);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showElement, setShowElement] = useState(false);
  const [isAnnotationUpdate, setAnnotationUpdate] = useState(true);
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  data = SHIFT_DATA_LIST[0];

  const onEditShiftAnnotation = (shiftCommentItem) => {
    setValue(shiftCommentItem.annotations);
    setAnnotationUpdate(false);
  };
  const displayShiftComments = (shiftCommentItem) => (
    <>
      <span style={{ fontWeight: 700, fontSize: '14px' }}>{t('label.comments')}: </span>{' '}
      <span>{shiftCommentItem.comment}</span>
    </>
  );

  const displayShiftAnnotation = (shiftCommentItem) => (
    <div>
      <span>{shiftCommentItem.annotations}</span>
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
          onClick={() => onEditShiftAnnotation(shiftCommentItem)}
        />
      </Tooltip>{' '}
    </div>
  );
  const fetchImage = async (shiftCommentId) => {
    const path = `shift_comments/download_images/${shiftCommentId}`;
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

  const addAnnotation = async () => {
    if (value) {
      const shiftData = {
        annotations: `${value}`
      };

      const path = `shifts/update/${data.shift_id}`;
      const response = await apiService.putShiftData(path, shiftData);
      if (response.status === 200) {
        setValue(response.data[0].annotations);
        setShowElement(true);
        setStatusMessage('msg.annotationSubmit');
        setTimeout(() => {
          // setAnnotationUpdate(false);
          setAnnotationUpdate(true);
          setShowElement(false);
        }, 3000);
      }
    }
  };

  let id = 1;
  if (data && data.shift_logs) {
    data.shift_logs.map((row) => {
      row.id = id++;
      return row;
    });
  }

  const setAnnotationValue = (event) => {
    setValue(event);
  };
  const handleViewImageClose = () => {
    setOpenViewImageModal(false);
  };
  const renderMessageResponse = () => (
    <div>
      <InfoCard
        minHeight="15px"
        fontSize={16}
        color={InfoCardColorTypes.Success}
        message={t(statusMessage)}
        testId="successStatusMsg"
      />
    </div>
  );

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
          {images && images.length > 0 ? (
            <ImageDisplayComponent images={images} />
          ) : (
            <p>{t('label.noImageFound')}</p>
          )}
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
      <Grid container spacing={2} justifyContent="left">
        <Grid item xs={12} sm={12} md={4}>
          <Grid style={{ margin: 2 }} container spacing={2} justifyContent="left">
            <Grid item xs={12} sm={12} md={12}>
              <span id="operatorName" style={{ fontWeight: 'bold', alignItems: 'center' }}>
                {t('label.operatorName')}{' '}
              </span>
              <span> : {data.shift_operator}</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <span id="shiftStart" style={{ fontWeight: 'bold' }}>
                {t('label.shiftStartedAt')}{' '}
              </span>
              <span>: {data.shift_start ? toUTCDateTimeFormat(data.shift_start) : 'NA'}</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <span id="shiftEnd" style={{ fontWeight: 'bold', alignItems: 'center' }}>
                {t('label.shiftEndsAt')}{' '}
              </span>
              <span>: {data.shift_end ? toUTCDateTimeFormat(data.shift_end) : 'Active shift'}</span>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <h3>{t('label.addAnnotationLabel')}</h3>
              <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
                {isAnnotationUpdate && !data.annotations && (
                  <Grid item xs={12} sm={12} md={12}>
                    <TextEntry
                      setValue={setAnnotationValue}
                      rows={2}
                      label={t('label.addAnnotation')}
                      value={value}
                      testId="annotation"
                    />
                  </Grid>
                )}
                {isAnnotationUpdate && !data.annotations && (
                  <Grid item xs={12} sm={12} md={3}>
                    <Button
                      size={ButtonSizeTypes.Small}
                      icon={<AddIcon />}
                      disabled={!(data && data.shift_end)}
                      ariaDescription="Button for submitting comment"
                      label="Add"
                      testId="commentButton"
                      onClick={addAnnotation}
                      variant={ButtonVariantTypes.Contained}
                      color={ButtonColorTypes.Secondary}
                    />
                  </Grid>
                )}
                {!isAnnotationUpdate && data.annotations && (
                  <Grid item xs={12} sm={12} md={12}>
                    <TextEntry
                      setValue={setAnnotationValue}
                      rows={2}
                      label={t('label.addAnnotation')}
                      value={value}
                      testId="annotation"
                    />
                  </Grid>
                )}
                {!isAnnotationUpdate && data.annotations && (
                  <Grid item xs={12} sm={12} md={3}>
                    <Button
                      size={ButtonSizeTypes.Small}
                      icon={<AddIcon />}
                      disabled={!(data && data.shift_end)}
                      ariaDescription="Button for submitting comment"
                      label="Add"
                      testId="commentButton"
                      onClick={addAnnotation}
                      variant={ButtonVariantTypes.Contained}
                      color={ButtonColorTypes.Secondary}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={9}
                  style={{ position: 'absolute', zIndex: 2, bottom: '-2%', left: '20%' }}
                >
                  {showElement ? renderMessageResponse() : ''}
                </Grid>
                <Grid container spacing={2} justifyContent="left">
                  <Grid item xs={12} sm={12} md={9} marginLeft={2}>
                    {isAnnotationUpdate && data.annotations && displayShiftAnnotation(data)}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={1} />
        <Grid item xs={12} sm={12} md={7}>
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
              {data &&
                data.comments &&
                data.comments.length > 0 &&
                data.comments.map((shiftCommentItem, shiftCommentIndex) => (
                  <div key={shiftCommentItem.id}>
                    <Grid container justifyContent="start">
                      <Grid item xs={12} sm={12} md={9}>
                        <p>
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
                          data-testid="viewShiftHistoryImages"
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

      <Grid container sx={{ padding: 2, paddingLeft: 0 }} spacing={2} />
      <Paper sx={{ border: '1px solid darkgrey' }}>
        <Grid container spacing={2} justifyContent="left">
          <Grid item xs={12} sm={12} md={12}>
            <Paper sx={{ padding: '10px' }}>
              <Typography
                id="viewLogDataIDLabel"
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
