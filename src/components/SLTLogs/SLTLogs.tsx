/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import {
  Button,
  ButtonVariantTypes,
  DropDown,
  FileUpload,
  InfoCard,
  InfoCardColorTypes,
  ButtonColorTypes,
  ButtonSizeTypes,
} from '@ska-telescope/ska-gui-components';
import { Box, Grid, Paper, TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {
  ENTITY,
  CHARACTER_LIMIT,
  COMMENT_PADDING,
  DEFAULT_TIME,
  operatorName,
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';
import SLTLogMockList from '../../mockData/SLTLogMock';

function SLTLogs() {
  const [shiftStartTime, setShiftStartTime] = useState(DEFAULT_TIME);
  const [statusMessage, setStatusMessage] = useState(null);
  const [shiftShowStart, setShiftShowStart] = useState(DEFAULT_TIME);
  const [shiftShowEnd, setShiftShowEnd] = useState(DEFAULT_TIME);
  const [dataDetails, setSltLogs] = useState([]);
  const [startShift, setStartShift] = useState(false);
  const [shiftEndTime, setShiftEndTime] = useState(DEFAULT_TIME);
  const [showElement, setShowElement] = useState(false);
  const [responseCode, setMessageCode] = useState(null);
  const [operator, setOperator] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [value, setValue] = useState('');
  const { t } = useTranslation('translations');
  const [interval, setTime] = useState(null);

  const getShiftStartTime = async () => {
    console.log('operator', operator, operator.length);

    if (operator.length === 0) {
      setMessageCode(200);
      setStatusMessage('msg.selectOperator');
      setShowElement(true);
      setTimeout(() => {
        setShowElement(false);
      }, 2000);
    } else {
      setStartShift(true);

      const shiftData = {
        shift_operator: { name: operator },
      };

      const path = `shifts`;
      const response = await apiService.postShiftData(path, shiftData);
      setMessageCode(response.status);
      setStatusMessage('msg.shiftStarted');
      setShowElement(true);
      setTimeout(() => {
        setShowElement(false);
      }, 3000);

      setShiftShowStart(moment(response.data.data.shift_start).format('DD-MM-YYYY HH:mm:ss'));
      setShiftStartTime(response.data.data.shift_start);
      setShiftId(response.data.data.id);

      const interval = setInterval(() => {
        updateLogs(response.data.data.id);
      }, 5000);
      setTime(interval);
    }
  };

  const getShiftEndTime = async () => {
    let shiftData;

    if (value !== '') {
      shiftData = {
        shift_operator: { name: operator },
        shift_start: shiftStartTime,
        shift_end: moment().utc().toISOString(),
        id: shiftId,
        comments: value,
      };
    } else {
      shiftData = {
        shift_operator: { name: operator },
        shift_start: shiftStartTime,
        shift_end: moment().utc().toISOString(),
        id: shiftId,
      };
    }

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    setShiftShowEnd(moment(response.data.data.shift_end).format('DD-MM-YYYY HH:mm:ss'));
    setMessageCode(response.status);
    setStatusMessage('msg.shiftEnd');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
      setStartShift(false);
      setOperator('');
      clearInterval(interval);

      setShiftStartTime(DEFAULT_TIME);
      setShiftShowStart(DEFAULT_TIME);
      setShiftShowEnd(DEFAULT_TIME);
      setValue('');
      setShiftEndTime(DEFAULT_TIME);
    }, 2000);
  };

  const getSubmit = async () => {
    if (value === '') return;

    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStartTime,
      comments: `${value}, `,
    };

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    setMessageCode(response.status);
    setStatusMessage('msg.commentSubmit');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 2000);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
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

  const updateLogs = async (shiftId: number) => {
    const path = `shifts/${shiftId}`;
    const result = await apiService.getSltLogs(path);
    setSltLogs(
      result && result.data && result.data.shift_logs && result.data.shift_logs.length > 0
        ? result.data.shift_logs
        : [],
    );
  };

  const postImage = async (file) => {
    const path = `shifts/images/${shiftId}`;

    const formData = new FormData();
    formData.append('files', file);
    formData.append('fileName', file.name);
    const config = {
      headers: {
        accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
    };
    const result = await apiService.postImage(path, formData, config);

    setMessageCode(result.status);
    setStatusMessage('msg.imageUpload');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 2000);
  };

  const renderMessageResponse = () => {
    if (responseCode === 200) {
      return (
        <InfoCard
          fontSize={20}
          color={InfoCardColorTypes.Success}
          message={t(statusMessage)}
          testId="successStatusMsg"
        />
      );
    }
    return false;
  };

  return (
    <Box>
      <Grid container padding={2} justifyContent="left">
        <Grid item xs={12} sm={12} md={1}>
          <Link to="/">
            <Button
              icon={<HomeIcon />}
              size={ButtonSizeTypes.Large}
              ariaDescription="Button for log tab"
              label={t('label.logButton')}
              testId="logButton"
              color={
                location.pathname === '/' ? ButtonColorTypes.Secondary : ButtonColorTypes.Inherit
              }
              variant={ButtonVariantTypes.Contained}
            />
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Link to="/history">
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

        <Grid item xs={12} sm={12} md={1} />
        <Grid item xs={12} sm={12} md={3}>
          {showElement ? renderMessageResponse() : ''}
        </Grid>
      </Grid>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <Grid container paddingLeft={2} spacing={2} sx={{ padding: 4 }} justifyContent="center">
          <Grid item sx={{ padding: 10 }} xs={12} sm={12} md={3}>
            <DropDown
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
          <Grid item xs={12} sm={12} md={4}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={12} md={6}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift Start: {shiftShowStart}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={6}>
                <Button
                  icon={<AccessTimeIcon />}
                  size={ButtonSizeTypes.Large}
                  disabled={disableStartShift()}
                  ariaDescription="Button for starting shift"
                  label={t('label.shiftStart')}
                  testId="shiftStartButton"
                  onClick={getShiftStartTime}
                  variant={ButtonVariantTypes.Contained}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={12} md={6}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift End: {shiftShowEnd}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={6}>
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
      </Paper>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <Grid container paddingLeft={COMMENT_PADDING} paddingTop={1} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={6}>
            <p style={{ fontWeight: 'bold', marginLeft: 8, alignItems: 'center' }}>
              Operator Comments
            </p>
            <TextField
              sx={{ width: 750, alignContent: 'flex-end' }}
              id="outlined-multiline-static"
              label="Please enter comments..."
              multiline
              rows={3}
              // inputProps={{
              //   maxLength: CHARACTER_LIMIT
              // }}
              // helperText={`${value.length}/${CHARACTER_LIMIT}`}
              value={value}
              onChange={handleChange}
            />
            <Grid item paddingTop={1} paddingBottom={1} xs={12} sm={12} md={6}>
              <Button
                icon={<SendIcon />}
                disabled={disableButtons()}
                ariaDescription="Button for submitting comment"
                label={t('label.submit')}
                testId="commentButton"
                onClick={getSubmit}
                variant={ButtonVariantTypes.Contained}
              />
            </Grid>
          </Grid>

          <Grid item paddingTop={1} xs={12} sm={12} md={6}>
            <FileUpload
              uploadFunction={postImage}
              chooseDisabled={disableButtons()}
              testId="fileId"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>Log Summary</p>
        <hr />

        <SLTLogTableList data={SLTLogMockList} />
      </Paper>
    </Box>
  );
}

export default SLTLogs;

// <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>Log Summary</p>
//         <hr />

//         {dataDetails && Array.isArray(dataDetails) && dataDetails.length > 0 ? (
//           <SLTLogTableList data={dataDetails} />
//         ) : (
//           <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }} id="logNotFound">
//             {t('msg.noLogsFound')}
//           </p>
//         )}
