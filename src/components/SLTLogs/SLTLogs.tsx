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
  ButtonSizeTypes
} from '@ska-telescope/ska-gui-components';
import { Box, Grid, Paper, TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ENTITY, COMMENT_PADDING, DEFAULT_TIME, operatorName } from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';
import SLTLogMockList from '../../mockData/SLTLogMock';

function SLTLogs() {
  const [shiftStartTime, setShiftStartTime] = useState(DEFAULT_TIME);
  const [shiftShowStart, setShiftShowStart] = useState(DEFAULT_TIME);
  const [shiftShowEnd, setShiftShowEnd] = useState(DEFAULT_TIME);

  const [statusMessage, setStatusMessage] = useState(null);
  const [dataDetails, setSltLogs] = useState([]);
  const [startShift, setStartShift] = useState(false);
  const [showElement, setShowElement] = useState(false);
  const [responseCode, setMessageCode] = useState(null);
  const [operator, setOperator] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [value, setValue] = useState('');
  const { t } = useTranslation('translations');
  const [interval, setTime] = useState(null);
  if (localStorage.getItem('id') !== null) {
    const currentID = JSON.parse(localStorage.getItem('id'));
    console.log('currentID', currentID);
  }

  const getShiftStartTime = async () => {
    if (operator.length === 0) {
      validateOperator();
    } else {
      setStartShift(true);

      const shiftData = {
        shift_operator: { name: operator },
        shift_start: moment().utc().toISOString()
      };

      const path = `shifts`;
      const response = await apiService.postShiftData(path, shiftData);
      setMessageCode(response.status);
      setStatusMessage('msg.shiftStarted');
      localStorage.setItem(
        'id',
        JSON.stringify(response && response.data && response.data.data && response.data.data.id)
      );
      // const tt = JSON.parse(localStorage.getItem('id'))
      // console.log('tt', tt);
      setShowElement(true);
      setTimeout(() => {
        setShowElement(false);
      }, 3000);
      setShiftShowStart(
        moment(response && response.data && response.data.data && response.data.data.shift_start)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      );
      setShiftStartTime(
        moment(response && response.data && response.data.data && response.data.data.shift_start)
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      );

      setShiftId(response.data.data.id);

      const interval = setInterval(() => {
        setSltLogs([SLTLogMockList[0]]);
      }, 5000);
      setTime(interval);
      const interval1 = setInterval(() => {
        setSltLogs([SLTLogMockList[1], SLTLogMockList[0]]);
      }, 10000);
      setTime(interval1);
      setInterval(() => {
        clearInterval(interval);
        clearInterval(interval1);
      }, 11000);
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
        comments: value
      };
    } else {
      shiftData = {
        shift_operator: { name: operator },
        shift_start: shiftStartTime,
        shift_end: moment().utc().toISOString(),
        id: shiftId
      };
    }

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    setShiftShowEnd(
      moment(response && response.data && response.data.data && response.data.data.shift_end)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss')
    );
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
      // setShiftEndTime(DEFAULT_TIME);
      localStorage.removeItem('id');
    }, 3000);
  };

  const getSubmit = async () => {
    if (value === '') return;

    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStartTime,
      comments: `${value}, `
    };

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
    setMessageCode(response.status);
    setStatusMessage('msg.commentSubmit');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 3000);
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
        : []
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
        'content-type': 'multipart/form-data'
      }
    };
    const result = await apiService.postImage(path, formData, config);

    setMessageCode(result.status);
    setStatusMessage('msg.imageUpload');
    setShowElement(true);
    setTimeout(() => {
      setShowElement(false);
    }, 3000);
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

  const validateOperator = () => {
    if (operator.length === 0) {
      return t('msg.selectOperator');
    }
    return '';
  };
  return (
    <Box>
      <Grid container  sx={{ margin: 2, marginBottom:0 }} justifyContent="end">
        <Grid item xs={12} sm={12} md={3}>
        <h2>Manage Shift</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={1} />
        <Grid item xs={12} sm={12} md={4}>
          {showElement ? renderMessageResponse() : ''}
        </Grid>
        <Grid item xs={12} sm={12} md={2} />
        <Grid item xs={12} sm={12} md={2}>
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
      </Grid>

      <Paper sx={{ border: 1, margin: 2, marginTop: 0 }}>
        <Grid container spacing={2} sx={{ padding: 2 }} justifyContent="center">
          <Grid item sx={{ padding: 10 }} xs={12} sm={12} md={3}>
            <DropDown
              errorText={validateOperator()}
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
          <Grid item xs={12} sm={12} md={5}>
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift starts at: {shiftShowStart}{' '}
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
                  onClick={getShiftStartTime}
                  variant={ButtonVariantTypes.Contained}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={12} md={7}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift ends at: {shiftShowEnd}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={5}>
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

      <Paper sx={{ border: 1, margin: 2 }}>
        <Grid container sx={{ padding: 2 }} alignItems="flex-start">
          <Grid item xs={12} sm={12} md={6}>
            <p style={{ fontWeight: 'bold', marginLeft: 8, alignItems: 'center' }}>
              Operator Comments
            </p>
            <TextField
              sx={{ width: '100%' }}
              id="outlined-multiline-static"
              label="Please enter comments..."
              multiline
              rows={3}
              value={value}
              onChange={handleChange}
            />
            <Grid item paddingTop={1} paddingBottom={1} xs={12} sm={12} md={6}>
              <Button
                icon={<AddIcon />}
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

      <Paper sx={{ border: 1, margin: 4 }}>
        <p style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>Log Summary</p>
        <hr />

        <SLTLogTableList data={dataDetails} />
      </Paper>
    </Box>
  );
}

export default SLTLogs;
