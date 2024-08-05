/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable  @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import {
  Button,
  ButtonVariantTypes,
  DropDown,
  FileUpload,
  ButtonColorTypes
} from '@ska-telescope/ska-gui-components';
import { Box, Grid, Paper, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  CHARACTER_LIMIT,
  COMMENT_PADDING,
  DEFAULT_TIME,
  operatorName
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';

function SLTLogs() {
  const [shiftStartTime, setShiftStartTime] = useState(DEFAULT_TIME);
  const [dataDetails, setSltLogs] = useState([]);
  const [startShift, setStartShift] = useState(false);
  const [shiftEndTime, setShiftEndTime] = useState(DEFAULT_TIME);
  const [operator, setOperator] = useState('');
  const [shiftId, setShiftId] = useState('');
  const [value, setValue] = useState('');
  const { t } = useTranslation('translations');
  const [interval, setTime] = useState(null);

  const getShiftStartTime = async () => {
    setStartShift(true);

    const shiftData = {
      shift_operator: { name: operator }
    };

    const path = `shifts`;
    const response = await apiService.postShiftData(path, shiftData);

    setShiftStartTime(response.data.data.shift_start);
    setShiftId(response.data.data.id);

    const interval = setInterval(() => {
      updateLogs();
    }, 5000);
    setTime(interval);
  };

  const getShiftEndTime = () => {
    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStartTime,
      shift_end: shiftEndTime,
      id: shiftId,
      comments: value
    };

    setStartShift(false);
    setOperator(null);
    clearInterval(interval);

    setShiftStartTime(DEFAULT_TIME);
    setShiftEndTime(DEFAULT_TIME);

    const path = `shifts/${shiftId}`;
    const response = apiService.putShiftData(path, shiftData);
  };

  const getSubmit = async () => {
    const shiftData = {
      shift_operator: { name: operator },
      shift_start: shiftStartTime,
      comments: value
    };

    setValue('');

    const path = `shifts/${shiftId}`;
    const response = await apiService.putShiftData(path, shiftData);
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

  const updateLogs = async () => {
    const result = await apiService.getSltLogs();
    setSltLogs(result.data);
  };

  return (
    <Box>
      <Grid paddingLeft={2} item xs={4} sm={12} md={2}>
        <Link to="/history">
          <Button
            ariaDescription="Button for history tab"
            label={t('label.history')}
            testId="historyButton"
            color={ButtonColorTypes.Secondary}
            variant={ButtonVariantTypes.Contained}
          />
        </Link>
      </Grid>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <Grid container spacing={2} sx={{ padding: 2 }} justifyContent="left">
          <Grid item xs={12} sm={12} md={3}>
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
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={6}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift Start: {shiftStartTime}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={6}>
                <Button
                  disabled={disableStartShift()}
                  ariaDescription="Button for starting shift"
                  label={t('label.shiftStart')}
                  testId="shiftStartButton"
                  onClick={getShiftStartTime}
                  variant={ButtonVariantTypes.Contained}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={6}>
                <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>
                  Shift End: {shiftEndTime}{' '}
                </p>
              </Grid>

              <Grid sx={{ marginTop: 1 }} item xs={12} sm={12} md={6}>
                <Button
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
            <TextField
              sx={{ width: 750, alignContent: 'flex-end' }}
              id="outlined-multiline-static"
              label="Please enter comments..."
              multiline
              rows={3}
              inputProps={{
                maxLength: CHARACTER_LIMIT
              }}
              helperText={`${value.length}/${CHARACTER_LIMIT}`}
              onChange={handleChange}
            />
            <Grid item paddingBottom={1} xs={12} sm={12} md={6}>
              <Button
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
            <FileUpload chooseDisabled={disableButtons()} testId="fileId" />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }}>Log Summary</p>
        <hr />

        {dataDetails && Array.isArray(dataDetails) && dataDetails.length > 0 ? (
          <SLTLogTableList data={dataDetails} />
        ) : (
          <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }} id="logNotFound">
            {t('msg.noLogsFound')}
          </p>
        )}
      </Paper>
    </Box>
  );
}

export default SLTLogs;
