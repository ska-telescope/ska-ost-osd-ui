import React, { useEffect, useState } from 'react';
import { Button, ButtonVariantTypes, DropDown, TextEntry, FileUpload, ButtonColorTypes} from '@ska-telescope/ska-gui-components';
import { Box, Grid } from '@mui/material';
import SearchIcon  from '@mui/icons-material/Search';
import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Filters from '../Filters';
import Navigation from '../navigation';
import {
  ENTITY,
  ENTITY_ID,
  makeUrlPath
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTLogTableList from './SLTTableList/SLTTableList';

interface OperatorName {
  label: string;
  value: string;
}

const CHARACTER_LIMIT = 200;

const operatorName: OperatorName[] = [
  { label: 'Chandler Bing', value: 'Chandler Bing' },
  { label: 'Jake Peralta', value: 'Jake Peralta' },
  { label: 'Ross Geller', value: 'Ross Geller' },
  { label: 'Monica Geller', value: 'Monica Geller' },
];


function SLTLogs() {

  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [startShift, setStartShift] = useState(false);
  const [shiftEndTime, setShiftEndTime] = useState(null);
  const [operator, setOperator] = useState(null);
  const [value, setValue] = useState("");
  const { t } = useTranslation('translations');

  const getShiftStartTime = () => {

    setStartShift(true);
    const shiftData = {

      shift_operator: operator,

    }
    console.log(shiftData);

    // const baseURL = `/shift`;
    // const response = await apiService.postShiftData(baseURL, shiftData);
    // setShiftStartTime(response.shift_start);

  
  }
  
  
  const getShiftEndTime = () => {

    const shiftData = {

      shift_operator: operator,
      comments: value

    }
    console.log(shiftData);
  
    // const baseURL = `/shift`;
    // const response = await apiService.putShiftData(baseURL, shiftData);
    // setShiftEndTime(response.shift_end);
  
  }

  const getSubmit = () => {

    const shiftData = {

      shift_operator: operator,
      comments: value

    }
    console.log(shiftData);
  
    // const baseURL = `/shift`;
    // const response = await apiService.putShiftData(baseURL, shiftData);

    setStartShift(false);

  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const disableStartShift = () => {

    if (startShift === true){
      return true;
    }
    else {
      return false;
    }
  }

  const disableButtons = () => {

    console.log(startShift);

    if (startShift === false){
      return true;
    }
    else {
      return false;
    }
  }

  return (
    <Box>
      <Grid container paddingTop={2} direction="row" justifyContent="space-evenly">

      <Grid item xs={6} sm={12} md={2}>
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
        </Grid>

      <Grid item xs={12} sm={12} md={2}>
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

        <Grid item xs={12} sm={12} md={2}>
        <Button
          disabled={disableStartShift()}
            ariaDescription="Button for starting shift"
            label={t('label.shiftStart')}
            testId="shiftStartButton"
            onClick={getShiftStartTime}
            variant={ButtonVariantTypes.Contained}
            />
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
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

        <Grid item xs={12} sm={12} md={2}>
          <p>Shift Start: {shiftStartTime} </p>
          <p>Shift End: --------------- </p>
        </Grid>
      </Grid>

      <Grid container paddingTop={30} paddingLeft={10} alignItems="flex-start">

      <Grid item xs={12} sm={12} md={4}>
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
        </Grid>
        </Grid>

        <Grid container paddingLeft={10} alignItems="flex-start">

        <Grid item >
        <FileUpload
            chooseDisabled={disableButtons()}
            testId="fileId"
            />
        </Grid>

        <Grid item >
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

    </Box>
  );
}

export default SLTLogs;








