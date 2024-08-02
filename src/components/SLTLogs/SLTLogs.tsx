import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonVariantTypes,
  DropDown,
  FileUpload,
  ButtonColorTypes
} from '@ska-telescope/ska-gui-components';
import { Box, Grid, Paper , TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import SLTLogMockList from '../../mockData/SLTLogMock';
import { ENTITY, operatorName, makeUrlPath } from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';



const CHARACTER_LIMIT = 200;
const COMMENT_PADDING = 10;


function SLTLogs() {
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [startShift, setStartShift] = useState(false);
  const [shiftEndTime, setShiftEndTime] = useState('-------------------');
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState('');
  const { t } = useTranslation('translations');

  const getShiftStartTime = () => {
    setStartShift(true);

    const shiftData = {
      shift_operator: operator
    };

    setShiftStartTime(moment(new Date()).format('DD/MM/YYYY hh:MM:SS'));

    // const baseURL = `/shift`;
    // const response = await apiService.postShiftData(baseURL, shiftData);
    // setShiftStartTime(response.shift_start);
  };

  const getShiftEndTime = () => {
    const shiftData = {
      shift_operator: operator,
      comments: value
    };

    setShiftEndTime(moment(new Date()).format('DD/MM/YYYY hh:MM:SS'));

    setStartShift(false);

    // const baseURL = `/shift`;
    // const response = await apiService.putShiftData(baseURL, shiftData);
    // setShiftEndTime(response.shift_end);
  };

  const getSubmit = () => {
    const shiftData = {
      shift_operator: operator,
      comments: value
    };
    // console.log(shiftData);

    setValue('');

    // const baseURL = `/shift`;
    // const response = await apiService.putShiftData(baseURL, shiftData);

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
    // console.log(startShift);

    if (startShift === false) {
      return true;
    } 
      return false;
    
  };

  return (
    <Box>
    <Paper elevation={12} sx={{"border":1, "margin": 1}}>
      <Grid container background-color="blue" paddingTop={2} direction="row" justifyContent="space-evenly">
        <Grid item paddingTop={3} xs={6} sm={12} md={2}>
          <Link to="/history">
            <Button
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

        <Grid item xs={4} sm={12} md={2}>
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

        <Grid item xs={4} sm={12} md={2}>
          <Button
            disabled={disableStartShift()}
            ariaDescription="Button for starting shift"
            label={t('label.shiftStart')}
            testId="shiftStartButton"
            onClick={getShiftStartTime}
            variant={ButtonVariantTypes.Contained}
          />
        </Grid>

        <Grid item xs={4} sm={12} md={2}>
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

        <Grid item xs={4} sm={12} md={2}>
          <p>Shift Start: {shiftStartTime} </p>
          <p>Shift End: {shiftEndTime} </p>
        </Grid>
      </Grid>
      
      <Grid container paddingTop={2} direction="row" justifyContent="space-evenly" />
      </Paper>

      <Paper elevation={12} sx={{"border":1, "margin": 1}}>
      <Grid container paddingLeft={COMMENT_PADDING} paddingTop={1} alignItems="flex-start">
        <Grid item xs={12} sm={12} md={6}>
          <TextField
              sx={{ width: 400,alignContent:'flex-end' }}
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
      <Paper elevation={12} sx={{"border":1, "margin": 1}}>
      
        {SLTLogMockList && Array.isArray(SLTLogMockList) && SLTLogMockList.length > 0 ? (
          <SLTLogTableList data={SLTLogMockList} />
        ) : (
          <p id="logNotFound">{t('msg.noLogsFound')}</p>
        )}
      
      </Paper>
      </Box>
     
  );
}

export default SLTLogs;
