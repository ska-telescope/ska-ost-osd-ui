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
  TextEntry,
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
  useTheme,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Kafka } from 'kafkajs';
import { ENTITY, DEFAULT_TIME, operatorName, toUTCDateTimeFormat } from '../../utils/constants';
import apiService from '../../services/apis';
import ImageDisplay from './ImageDisplay';
import ShiftLogs from './ShiftLogs';

const useKafkaData = (topic) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const kafka = new Kafka({
      clientId: window.location.hostname,
      brokers: ['localhost:9092'],
    });
    const consumer = kafka.consumer({ groupId: 'my_consumer_group' });
    const run = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ message }) => {
          setMessages((prevMessages) => [...prevMessages, message.value.toString()]);
        },
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
  const theme = useTheme();
  const [displayShiftStart, setDisplayShiftStart] = useState(DEFAULT_TIME);
  const [shiftStart, setShiftStart] = useState('');
  const [shiftStatus, setShiftStatus] = useState('');
  const [displayShiftEnd, setDisplayShiftEnd] = useState(DEFAULT_TIME);
  const [openViewImageModal, setOpenViewImageModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [isShiftCommentUpdate, setShiftCommentUpdate] = useState(false);
  const [openShiftImageModal, setOpenShiftImageModal] = useState(false);
  
  const [message, setMessage] = useState('');
  const [dataDetails, setShiftData] = useState(null
  //   {
  //   shift_id: 'shift-20241028-148',
  //   shift_start: '2024-10-22T11:24:04.389077Z',
  //   shift_operator: 'john',
  //   shift_comment: [
  //     {
  //       shift_comments: 'Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printing ',
  //       created_on:  '2024-10-22T11:24:14.406107Z',
  //       id: 1,
  //       isEdit: false,
  //     },
  //     {
  //       shift_comments: 'Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printingLorem Ipsum is simply dummy text of the printing ',
  //       created_on:  '2024-10-22T11:24:14.406107Z',
  //       id: 2,
  //       isEdit: false,
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
  //           last_modified_on: '2024-10-22T11:25:36.953526Z',
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
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.scan',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             error: { detail: 'this is an error' },
  //             status: 'ERROR',
  //             request: 'ska_oso_scripting.functions.devicecontrol.end',
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //         ],
  //       },
  //       source: 'ODA',
  //       log_time: '2024-10-22T11:24:14.406107Z',
  //       log_comment: [
  //         {
  //           logcomments: 'Lorem Ipsum is simply dummy text of the printing ',
  //           logCommentTime: '23-10-2024',
  //           id: 1,
  //           isEdit: false,
  //         },
  //         {
  //           logcomments:
  //             'Submitting Comments: We will implement a function to handle the submission of comments, making a POST request to the API for each comment',
  //           logCommentTime: '23-10-2024',
  //           id: 2,
  //           isEdit: false,
  //         },
  //         {
  //           logcomments:
  //             'Handling Input Changes: We will ensure that each text field can be updated independently.',
  //           logCommentTime: '23-10-2024',
  //           id: 3,
  //           isEdit: false,
  //         },
  //       ],
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
  //           last_modified_on: '2024-10-22T11:25:36.953526Z',
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
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.scan',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             status: 'OK',
  //             request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
  //             response: { result: 'this is a result' },
  //             request_args: { kwargs: { subarray_id: '1' } },
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //             response_received_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //           {
  //             error: { detail: 'this is an error' },
  //             status: 'ERROR',
  //             request: 'ska_oso_scripting.functions.devicecontrol.end',
  //             request_sent_at: '2022-09-23T15:43:53.971548Z',
  //           },
  //         ],
  //       },
  //       source: 'ODA',
  //       log_time: '2024-10-22T11:24:14.406107Z',
  //     },
  //   ],
  //   metadata: {
  //     created_by: 'john',
  //     created_on: '2024-10-22T11:24:04.388998Z',
  //     last_modified_by: 'john',
  //     last_modified_on: '2024-10-22T11:25:36.971764Z',
  //   },
  // }
  );
  const [displayMessageElement, setDisplayMessageElement] = useState(false);
  const [displayModalMessageElement, setDisplayModalMessageElement] = useState(false);
  
  const [operator, setOperator] = useState(null);
  const [shiftId, setShiftId] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [shiftCommentValue, setShiftComment] = useState('');
  const { t } = useTranslation('translations');
  const [images, setImages] = useState([]);
  const location = useLocation();
  const [inputValue, setInputValue] = React.useState('');
  const messages = useKafkaData('slt-to-frontend-topic');
  // const messages = []
  const [openDialog, setOpenDialog] = React.useState(false);

  const onEditShiftComment = (shiftCommentIndex,shiftCommentItem) => {
    console.log('onEditShiftComment',shiftCommentIndex,shiftCommentItem)
    setOpenSummaryModal(true)
    setShiftCommentUpdate(true)
    setShiftComment(shiftCommentItem.shift_comments)

    // dataDetails["shift_comment"][shiftCommentIndex]["shift_comments"]["isEdit"]=true;
    // setShiftComment(shiftCommentItem["shift_comments"])
    // setLogComment(shiftData["shift_logs"][logIndex]["log_comment"][commentIndex])
      };

  const displayShiftComments = (shiftCommentIndex,shiftCommentItem) => (
    <div>
      <span>{shiftCommentItem.shift_comments}</span>
     <Tooltip title="Edit the log comment" placement="bottom-end">  
<DriveFileRenameOutlineIcon
color='secondary'
aria-label={t('ariaLabel.edit')}
data-testid="manageEntityStatus"
style={{ 
cursor: 'pointer', position: 'relative', top: '7px' }}
onClick={()=>onEditShiftComment(shiftCommentIndex,shiftCommentItem)}
/>
</Tooltip> </div>

);

  const fetchImage = async () => {
    const path = `shifts/download_image/${shiftId}`;
    const result = await apiService.getImage(path);
    setImages(result && result.data && result.data[0]);
  };

  const updateShiftLogs = async (shiftID) => {
    if (messages && message.length > 0) {
      const path = `shift?shift_id=${shiftID}`;
      const result = await apiService.getSltLogs(path);
      if (result && result.status === 200) {
        setShiftData(
          result && result.data && result.data.length > 0 && result.data[0]
            ? result.data[0]
            : [],
        );
      }
    }
  };

  const startNewShift = async () => {
    const shiftData = {
      shift_operator: operator,
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
        moment(response.data[0].shift_start).utc().format('DD-MM-YYYY HH:mm:ss'),
      );
      setShiftId(response.data[0].shift_id);
      setShiftData(
        response && response.data && response.data.length > 0 && response.data[0]
          ? response.data[0]
          : [],
      );
      setShiftData(  
         {
        shift_id: 'shift-20241028-148',
        shift_start: '2024-10-22T11:24:04.389077Z',
        shift_operator: 'john',
        shift_comment: [
          {
            shift_comments:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        created_on: '2024-10-22T11:24:14.406107Z',
            id: 1,
            isEdit: false,
          },
          {
            shift_comments:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        created_on: '2024-10-22T11:24:14.406107Z',
            id: 2,
            isEdit: false,
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
                last_modified_on: '2024-10-22T11:25:36.953526Z',
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
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.scan',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  error: { detail: 'this is an error' },
                  status: 'ERROR',
                  request: 'ska_oso_scripting.functions.devicecontrol.end',
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                },
              ],
            },
            source: 'ODA',
            log_time: '2024-10-22T11:24:14.406107Z',
            log_comment: [
              {
                logcomments: 'Lorem Ipsum is simply dummy text of the printing ',
                logCommentTime: '23-10-2024',
                id: 1,
                isEdit: false,
              },
              {
                logcomments:
                  'Submitting Comments: We will implement a function to handle the submission of comments, making a POST request to the API for each comment',
                logCommentTime: '23-10-2024',
                id: 2,
                isEdit: false,
              },
              {
                logcomments:
                  'Handling Input Changes: We will ensure that each text field can be updated independently.',
                logCommentTime: '23-10-2024',
                id: 3,
                isEdit: false,
              },
            ],
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
                last_modified_on: '2024-10-22T11:25:36.953526Z',
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
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.configure_resource',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.scan',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  status: 'OK',
                  request: 'ska_oso_scripting.functions.devicecontrol.release_all_resources',
                  response: { result: 'this is a result' },
                  request_args: { kwargs: { subarray_id: '1' } },
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                  response_received_at: '2022-09-23T15:43:53.971548Z',
                },
                {
                  error: { detail: 'this is an error' },
                  status: 'ERROR',
                  request: 'ska_oso_scripting.functions.devicecontrol.end',
                  request_sent_at: '2022-09-23T15:43:53.971548Z',
                },
              ],
            },
            source: 'ODA',
            log_time: '2024-10-22T11:24:14.406107Z',
          },
        ],
        metadata: {
          created_by: 'john',
          created_on: '2024-10-22T11:24:04.388998Z',
          last_modified_by: 'john',
          last_modified_on: '2024-10-22T11:25:36.971764Z',
        },
      })
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
      if (response && response.data && response.data.length > 0) {
        setDisplayShiftStart(moment(response.data[0].shift_start).format('DD-MM-YYYY HH:mm:ss'));
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
  }, []);

  const endNewShift = async () => {
    const shiftData = {
      shift_operator: operator,
      shift_start: shiftStart,
      shift_end: moment().utc().toISOString(),
      comments: `${shiftCommentValue}`,
    };

    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.shiftEnd');
      setDisableButton(true)
      setDisplayMessageElement(true);
      setDisplayShiftEnd(moment(response.data[0].shift_end).utc().format('DD-MM-YYYY HH:mm:ss'));
      setTimeout(() => {
        setDisplayMessageElement(false);
        setOperator('');
        setDisplayShiftStart(DEFAULT_TIME);
        setDisplayShiftEnd(DEFAULT_TIME);
        setShiftComment('');
      }, 3000);
    }
  };

  const addShiftComments = async () => {
    if (shiftCommentValue === '') return;
  console.log('operatoroperator',operator)
    const shiftData = {
      shift_operator: operator,
      comments: `${shiftCommentValue}`,
    };
    const path = `shifts/update/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    if (response.status === 200) {
      setMessage('msg.commentSubmit');
      setDisplayModalMessageElement(true);
     
      setTimeout(() => {
        setShiftComment('')
        setDisplayModalMessageElement(false);
      }, 3000);
    }
  };

  const setShiftCommentValue = (event) => {
    setShiftComment(event);
  };

  const disableStartShift = () => {
    console.log('ooooooooooo', operator);
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
        'content-type': 'multipart/form-data',
      },
    };
    await apiService.postImage(path, formData, config);

    setMessage('msg.imageUpload');
    setDisplayMessageElement(true);
    setTimeout(() => {
      setDisplayMessageElement(false);
    }, 3000);
  };

  const postShiftCommentImage = async (file) => {
    const path = `shifts/upload_image/${shiftId}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    };
    await apiService.postImage(path, formData, config);

    setMessage('msg.imageUpload');
    setDisplayMessageElement(true);
    setTimeout(() => {
      setDisplayMessageElement(false);
    }, 3000);
  };

  const postShiftImage = async (file) => {
    const path = `shifts/upload_image/${shiftId}`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    };
    await apiService.postImage(path, formData, config);

    setMessage('msg.imageUpload');
    setDisplayMessageElement(true);
    setTimeout(() => {
      setDisplayMessageElement(false);
    }, 3000);
  };

  const handleViewImageClose = () => {
    setOpenViewImageModal(false);
  };
  const handleOpenImage = () => {
    console.log('wwwwwwwwwwwwwww');
    setOpenViewImageModal(true);
    // fetchImage();
  };
  const handlesetOpenSummaryModal = () => {
    console.log('wwwwwwwwwwwwwww');
    setShiftCommentUpdate(false)
    setOpenSummaryModal(true);
    // fetchImage();
  };

  const handleOpenShiftImagesModal = () => {
    console.log('wwwwwwwwwwwwwww');
    
    setOpenShiftImageModal(true);
    // fetchImage();
  };

  const handleSummaryModalClose = () => {
    setOpenSummaryModal(false);
  };

  const handleShiftImageModalClose = () => {
    setOpenShiftImageModal(false);
  };

  const renderMessageResponse = () => (
    <InfoCard
      minHeight="20px"
      fontSize={18}
      color={InfoCardColorTypes.Success}
      message={t(message)}
      testId="successStatusMsg"
    />
  );

  const renderModalMessageResponse = () => (
    <InfoCard
      minHeight="20px"
      fontSize={18}
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

  const shiftAction = (value) => {
    setShiftStatus(value);
    setOpenDialog(true);
  };
  const newShiftConfirmation = (confirmation) => {
    if (confirmation == 'YES' && shiftStatus == 'START') {
      setOpenDialog(false);
      startNewShift();
    } else if (confirmation == 'YES' && shiftStatus == 'END') {
      setOpenDialog(false);
      endNewShift();
    } else {
      setOpenDialog(false);
      return false;
    }
  };

  const handleDialogResponse = () => {
    setOpenDialog(false);
  };

  const startShiftAlertTitle = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography variant="h5">Start new shift ?</Typography>
      </Grid>
    </Grid>
  );

  const startShiftAlertContent = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography>You are about to start new shift.</Typography>
        <Typography>Are you sure you want to continue ?</Typography>
      </Grid>
    </Grid>
  );
  const endShiftAlertTitle = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography variant="h5">End current shift ?</Typography>
      </Grid>
    </Grid>
  );

  const onUpdateCommentsEvent = () => {
    // fetchSltCurrentShifts()

    console.log('event event');
    setShiftData(null);
  };
  const endShiftAlertContent = () => (
    <Grid container direction="row" justifyContent="space-around" alignItems="center">
      <Grid item>
        <Typography>You are about to end current shift.</Typography>
        <Typography>Are you sure you want to continue ?</Typography>
      </Grid>
    </Grid>
  );
  return (
    <Box>
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
              maxWidth: '1000px',
            },
          },
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
    
    

      <Box sx={{ marginLeft: 2, marginTop: 0, marginBottom: 2, position: 'relative' }}>
        <Grid container justifyContent="start">
          <Grid item xs={12} sm={12} md={3}>
            <h2 style={{ margin: 0, marginBottom: '10px' }} data-testid="manageShift">
              {t('label.manageShift')}
            </h2>
          </Grid>
          <Grid item xs={12} sm={12} md={2} />
          <Grid item xs={12} sm={12} md={4}>
            <div  style={{ position: 'absolute', zIndex: 2 }}>
            {displayMessageElement ? renderMessageResponse() : ''}
            </div>
             
          </Grid>
          <Grid item xs={12} sm={12} md={1} />
          <Grid item xs={12} sm={12} md={2} >
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
              disabled={disableStartShift()}
              ariaDescription="Button for starting shift"
              label={t('label.shiftStart')}
              testId="shiftStartButton"
              onClick={() => shiftAction('START')}
              variant={ButtonVariantTypes.Contained}
              color={ButtonColorTypes.Secondary}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3} sx={{ marginTop: 2 }}>
         {dataDetails && dataDetails.shift_start  &&  <Chip label={`Shift started at ${dataDetails && dataDetails.shift_start ? toUTCDateTimeFormat(dataDetails.shift_start):'NA'}`} color="primary" /> }
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
          {/* <Grid item xs={12} sm={12} md={1.3} sx={{ marginTop: 2 }}>
            <Button
              size={ButtonSizeTypes.Small}
              icon={<AddIcon />}
              disabled={disableButton}
              ariaDescription="Button for submitting comment"
              label="Images"
              testId="commentButton"
              onClick={handleOpenShiftImagesModal}
              variant={ButtonVariantTypes.Contained}
              color={ButtonColorTypes.Secondary}
            />
          </Grid> */}
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

          {/* <Grid item xs={12} sm={12} md={5}>
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  <span data-testid="shiftStart">{t('label.shiftStart')}</span>: {displayShiftStart}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={5}>
                <Button
                  icon={<AccessTimeIcon />}
                  size={ButtonSizeTypes.Small}
                  disabled={disableStartShift()}
                  ariaDescription="Button for starting shift"
                  label={t('label.shiftStart')}
                  testId="shiftStartButton"
                  onClick={()=>shiftAction('START')}
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
                  size={ButtonSizeTypes.Small}
                  disabled={disableButton}
                  ariaDescription="Button for ending shift"
                  label={t('label.shiftEnd')}
                  testId="shiftEndButton"
                  onClick={()=>shiftAction('END')}
                  variant={ButtonVariantTypes.Contained}
                  color={ButtonColorTypes.Error}
                />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
     
     { dataDetails &&  dataDetails.shift_comment && dataDetails.shift_comment.length>0  &&   <Grid container sx={{ padding: 2, paddingTop: 0, maxHeight:"500px",overflowY: "scroll" }} >
        <Grid item xs={12} sm={12} md={12}>
        <div><p style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '18px',marginBottom:0 }}>View shift comments</p></div>
        {dataDetails && dataDetails.shift_comment && dataDetails.shift_comment.length>0 &&
        dataDetails.shift_comment.map((shiftCommentItem,shiftCommentIndex) => (
          <div key={shiftCommentItem.id}>
              <Grid container justifyContent="start">
            
                    <Grid item xs={12} sm={12} md={4}>
                    <p >
            <span style={{  fontWeight: 700, fontSize: '14px' }}>
                        Commented at: </span> {' '}<span>{toUTCDateTimeFormat(shiftCommentItem.created_on)}
                      </span>
            </p>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                    <p
                 style={{color: theme.palette.secondary.main, cursor: 'pointer', textDecoration: 'underline' }}
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
                    {shiftCommentItem && shiftCommentItem.shift_comments && displayShiftComments(shiftCommentIndex,shiftCommentItem)}
                      </Grid>
                    </Grid>
           
                   { shiftCommentIndex !== dataDetails.shift_comment.length-1 && <Divider style={{marginTop:'15px'}} />}
</div>

        ))}
</Grid>
        </Grid>
        }

        <Grid container sx={{ padding: 2, paddingTop: 0 }}>
          <Grid item xs={12} sm={12} md={6}>
            <Grid container spacing={2} justifyContent="left">
              {/* <Grid item xs={12} sm={12} md={4}>
              <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                disabled={disableButton}
                ariaDescription="Button for submitting comment"
                label="Add shift summary"
                testId="commentButton"
                onClick={handleOpenImage}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              /> */}
              {/* <p data-testid="addComment" style={{ fontWeight: 'bold' }}>
            Add shift summary
            </p> */}
              {/* </Grid> */}
              {/* <Grid item xs={12} sm={12} md={4}>
              <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                disabled={disableButton}
                ariaDescription="Button for submitting comment"
                label="Add shift images"
                testId="commentButton"
                onClick={handleOpenImage}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
                </Grid> */}
              {/* <Grid item xs={12} sm={12} md={6}>
                <p
                  aria-hidden="true"
                  data-testid="viewImages"
                  style={{color: theme.palette.secondary.main, cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={handleOpenImage}
                >
                  View all summary
                </p>
              </Grid> */}
            </Grid>
            {/* <Grid container spacing={2} justifyContent="left" >
              <Grid item xs={12} sm={12} md={9}>
              <TextEntry
              setValue={setShiftCommentValue}
              rows={2}
              label="Please enter comments..."
              value={commentValue}
              testId="operatorComment"
            />
                </Grid>
                <Grid item xs={12} sm={12} md={3}  marginTop={7}>
                <Button
                size={ButtonSizeTypes.Small}
                icon={<AddIcon />}
                disabled={disableButton}
                ariaDescription="Button for submitting comment"
                label="Add"
                testId="commentButton"
                onClick={addShiftComments}
                variant={ButtonVariantTypes.Contained}
                color={ButtonColorTypes.Secondary}
              />
                  </Grid>
                </Grid> */}
          </Grid>
          {/* <Grid item paddingTop={1} xs={12} sm={12} md={6}>
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
                  style={{color: theme.palette.secondary.main, cursor: 'pointer', textDecoration: 'underline' }}
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
            <div style={{float: "left",marginTop:"30px"}} >
            <FileUpload
                        chooseColor={ButtonColorTypes.Secondary}
                        chooseVariant={ButtonVariantTypes.Contained}
                        clearLabel="Remove"
                        chooseDisabled={disableButton}
                        clearVariant={ButtonVariantTypes.Outlined}
                        buttonSize={ButtonSizeTypes.Small}
                        testId="shiftImageFileUpload"
                        uploadFunction={postImage}
                      />
            </div>
          
          </Grid> */}
        </Grid>
      </Paper>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogStatus"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1000px',
            },
          },
        }}
        open={openSummaryModal}
        onClose={handleSummaryModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        {!isShiftCommentUpdate && <DialogTitle>
          <Grid container spacing={2} justifyContent="left" style={{position:'relative'}}>
        <Grid item xs={12} sm={12} md={4}>
        Add shift comments and images
          </Grid>
          <Grid item xs={12} sm={12} md={4} style={{position:'absolute',zIndex:2,left: '40%',
    top: '-25%'}}>
          {displayModalMessageElement ? renderModalMessageResponse() : ''}
          </Grid>
          </Grid>
            </DialogTitle> }
        {isShiftCommentUpdate && <DialogTitle>
          <Grid container spacing={2} justifyContent="left" style={{position:'relative'}}>
        <Grid item xs={12} sm={12} md={5}>
        Update shift comments and add images 
          </Grid>
          <Grid item xs={12} sm={12} md={4}  style={{position:'absolute',zIndex:2,left: '40%',
    top: '-25%'}}>
          {displayModalMessageElement ? renderModalMessageResponse() : ''}
          </Grid>
          </Grid>
          
         
        </DialogTitle> }
        <DialogContent dividers>
        <Grid container spacing={2} justifyContent="left">
        <Grid item xs={12} sm={12} md={8}>
        {!isShiftCommentUpdate &&   <p style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '18px',marginBottom:0 }}>
                  Add Shift comments
                </p> }
                {isShiftCommentUpdate &&   <p style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '18px',marginBottom:0 }}>
                  Update Shift comments
                </p> }
               
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
                <p style={{ textDecoration: 'underline', fontWeight: 900, fontSize: '18px', marginLeft:'17px',marginBottom:0,marginTop:'25px'  }}>
                  Add Images
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
      <Paper sx={{ border: 1, margin: 2, marginTop: 0 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
          {t('label.logSummary')}
        </p>
        <Divider />
        {dataDetails && dataDetails.shift_logs && dataDetails.shift_logs.length > 0 ? (
          <ShiftLogs isCurrentShift={true} updateCommentsEvent={onUpdateCommentsEvent} shiftData={dataDetails} />
        ) : (
          <p style={{ padding: '10px' }}>{t('label.noLogsFound')}</p>
        )}
      </Paper>
    </Box>
  );
}

export default CurrentActiveShift;
