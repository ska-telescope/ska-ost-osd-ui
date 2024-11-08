import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Tooltip,
  Typography,
  useTheme
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
import DisplayShiftLogsComponent from '../../CurrentShiftPage/DisplayShiftLogsComponent';
import { toUTCDateTimeFormat } from '../../../utils/constants';
import SHIFT_DATA_LIST from '../../../DataModels/DataFiles/shiftDataList';

const ViewShiftData = ({ data }) => {
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const [value, setValue] = useState(data && data.annotations);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showElement, setShowElement] = useState(false);
  const [isAnnotationUpdate, setAnnotationUpdate] = useState(!!data.annotations);
  const theme = useTheme();
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  console.log('qqqqqqqqqqqqqqqqqqqqqq',data)
  data = SHIFT_DATA_LIST[0]
  // data = {
  //   shift_id: 'shift-20241028-148',
  //   shift_start: '2024-10-22T11:24:04.389077Z',
  //   shift_operator: 'john',
  //   annotations: 'This is dummy annotations',
  //   shift_comment: [
  //     {
  //       shift_comments:
  //         'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  //       created_on: '2024-10-22T11:24:14.406107Z',
  //       id: 1,
  //       isEdit: false
  //     },
  //     {
  //       shift_comments:
  //         'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  //       created_on: '2024-10-22T11:24:14.406107Z',
  //       id: 2,
  //       isEdit: false
  //     }
  //   ],
  //   shift_logs: [
  //     {
  //       info: {
  //         eb_id: 'eb-t0001-20241022-00002',
  //         sbd_ref: 'sbd-t0001-20240822-00008',
  //         sbi_ref: 'sbi-t0001-20240822-00009',
  //         metadata: {
  //           version: 1,
  //           created_by: 'DefaultUser',
  //           created_on: '2024-10-22T11:25:36.953526Z',
  //           pdm_version: '15.4.0',
  //           last_modified_by: 'DefaultUser',
  //           last_modified_on: '2024-10-22T11:25:36.953526Z'
  //         },
  //         interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
  //         telescope: 'ska_mid',
  //         sbi_status: 'failed',
  //         sbd_version: 1,
  //         request_responses: [
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.scan',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             error: { detail: 'this is an error' },
  //             status: 'ERROR',
  //             request: 'ska_oso_scripting.functions.devicecontrol.end',
  //             request_sent_at: '2022-09-23T15:43:53.971548Z'
  //           }
  //         ]
  //       },
  //       source: 'ODA',
  //       log_time: '2024-10-22T11:24:14.406107Z',
  //       log_comment: [
  //         {
  //           logcomments: 'Lorem Ipsum is simply dummy text of the printing ',
  //           logCommentTime: '23-10-2024',
  //           id: 1,
  //           isEdit: false
  //         },
  //         {
  //           logcomments:
  //             'Submitting Comments: We will implement a function to handle the submission of comments, making a POST request to the API for each comment',
  //           logCommentTime: '23-10-2024',
  //           id: 2,
  //           isEdit: false
  //         },
  //         {
  //           logcomments:
  //             'Handling Input Changes: We will ensure that each text field can be updated independently.',
  //           logCommentTime: '23-10-2024',
  //           id: 3,
  //           isEdit: false
  //         }
  //       ]
  //     },
  //     {
  //       info: {
  //         eb_id: 'eb-t0001-20241022-00002',
  //         sbd_ref: 'sbd-t0001-20240822-00008',
  //         sbi_ref: 'sbi-t0001-20240822-00009',
  //         metadata: {
  //           version: 1,
  //           created_by: 'DefaultUser',
  //           created_on: '2024-10-22T11:25:36.953526Z',
  //           pdm_version: '15.4.0',
  //           last_modified_by: 'DefaultUser',
  //           last_modified_on: '2024-10-22T11:25:36.953526Z'
  //         },
  //         interface: 'https://schema.skao.int/ska-oso-pdm-eb/0.1',
  //         telescope: 'ska_mid',
  //         sbi_status: 'failed',
  //         sbd_version: 1,
  //         request_responses: [
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.assign_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.scan',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z'
  //           },
  //           {
  //             error: { detail: 'this is an error' },
  //             status: 'ERROR',
  //             request: 'ska_oso_scripting.functions.devicecontrol.end',
  //             request_sent_at: '2022-09-23T15:43:53.971548Z'
  //           }
  //         ]
  //       },
  //       source: 'ODA',
  //       log_time: '2024-10-22T11:24:14.406107Z'
  //     }
  //   ],
  //   metadata: {
  //     created_by: 'john',
  //     created_on: '2024-10-22T11:24:04.388998Z',
  //     last_modified_by: 'john',
  //     last_modified_on: '2024-10-22T11:25:36.971764Z'
  //   }
  // };
  const onEditShiftAnnotation = (shiftCommentItem) => {
    setValue(shiftCommentItem.annotations);
    setAnnotationUpdate(false);
  };
  const displayShiftComments = (shiftCommentItem) => <span>{shiftCommentItem.comment}</span>;

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
  const fetchImage = async () => {
    const path = `shifts/download_image/${data.shift_id}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data[0]);
  };
  const handleOpenImage = () => {
    setOpenViewImageModal(true);
    fetchImage();
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
        minHeight="20px"
        fontSize={18}
        color={InfoCardColorTypes.Success}
        message={t(statusMessage)}
        testId="successStatusMsg"
      />
    </div>
  );

  return (
    <Box sx={{ padding: 2 }}>
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
        <Grid item xs={12} sm={12} md={5}>
          <Grid container spacing={2} justifyContent="left">
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
              <Grid container spacing={2} justifyContent="left" style={{ position: 'relative' }}>
                {!isAnnotationUpdate && (
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
                {!isAnnotationUpdate && (
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
        <Grid item xs={12} sm={12} md={7}>
          {data && data.comments && data.comments.length > 0 && (
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
                  data["comments"] &&
                  data["comments"].length > 0 &&
                  data["comments"].map((shiftCommentItem, shiftCommentIndex) => (
                    <div key={shiftCommentItem.id}>
                      <Grid container justifyContent="start">
                        <Grid item xs={12} sm={12} md={9}>
                          <p>
                            <span style={{ fontWeight: 700, fontSize: '14px' }}>
                              {t('label.commentedAt')} :
                            </span>{' '}
                            <span>{shiftCommentItem.created_on?toUTCDateTimeFormat(shiftCommentItem.created_on):'NA'}</span>
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
                            shiftCommentItem.comment &&
                            displayShiftComments(shiftCommentItem)}
                        </Grid>
                      </Grid>

                      {shiftCommentIndex !== data.comments.length - 1 && (
                        <Divider style={{ marginTop: '15px' }} />
                      )}
                    </div>
                  ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid container sx={{ padding: 2, paddingLeft: 0 }} spacing={2} />
      <Paper sx={{ border: 1, margin: 1 }}>
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
              ''
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewShiftData;
