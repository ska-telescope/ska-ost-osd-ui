import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonColorTypes,
  InfoCard,
  InfoCardColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  DateEntry,
  DropDown,
} from '@ska-telescope/ska-gui-components';
import { ENTITY, today, operatorName, makeUrlPath } from '../../utils/constants';

import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Label } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import ShiftDataTest from './ShiftData';

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [dataDetails, setSltHistory] = useState([]);
  const [createdAfter, setCreatedAfter] = useState(null);
  const [createdBefore, setCreatedBefore] = useState(null);
  const [displayTable, setDisplayTable] = useState(true);
  const [displayData, setDisplayData] = useState('');
  const [operator, setOperator] = useState('');

  const validateDates = () => {
    if (
      Date.parse(createdAfter) > Date.parse(today) ||
      Date.parse(createdBefore) > Date.parse(today)
    ) {
      return t('msg.errFutureDate');
    }
    if (Date.parse(createdAfter) > Date.parse(createdBefore)) {
      return t('msg.errInvalidDate');
    }
    return '';
  };

  const disableSearch = () => {
    if (operator !== '' || createdBefore !== '') {
      return false;
    }
    return true;
  };

  const fetchSltHistory = async () => {
    console.log('createdAfter', createdAfter);
    console.log('createdBefore', createdBefore);
    const path = makeUrlPath('shifts', createdAfter, createdBefore);
    const result = await apiService.getSltData(path);
    setSltHistory(result.data);
  };

  const handleClose = () => {
    setDisplayTable(true);
  };

  const onTriggerFunction = (data) => {
    setDisplayTable(false);
    setDisplayData(data);
  };

  return (
    <>
      <Grid container paddingTop={2} paddingLeft={2} justifyContent="left">
        <Grid item xs={12} sm={12} md={1}>
          <Link to="/">
            <Button
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
        <Grid item xs={12} sm={12} md={1}>
          <Link to="/history">
            <Button
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
      {/* <Grid item paddingLeft={2} xs={12} sm={12} md={2}>
        <Link to="/">
          <Button
            ariaDescription="Button for log tab"
            label={t('label.logButton')}
            testId="logButton"
            color={ButtonColorTypes.Secondary}
            variant={ButtonVariantTypes.Contained}
          />
        </Link>
      </Grid> */}
      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <Grid container paddingTop={2} direction="row" justifyContent="space-evenly">
          <Grid item xs={12} sm={12} md={2}>
            <DateEntry
              ariaDescription={t('ariaLabel.dateDescription')}
              ariaTitle={t('ariaLabel.date')}
              helperText={t('msg.requiredStartDate')}
              testId="dateEntryStart"
              errorText={validateDates()}
              label={t('label.startDate')}
              value={createdAfter}
              setValue={setCreatedAfter}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <DateEntry
              ariaDescription={t('ariaLabel.dateDescription')}
              ariaTitle={t('ariaLabel.date')}
              helperText={t('msg.requiredEndDate')}
              testId="dateEntryEnd"
              errorText={validateDates()}
              label={t('label.endDate')}
              value={createdBefore}
              setValue={setCreatedBefore}
            />
          </Grid>

          <Grid paddingTop={2} item xs={12} sm={12} md={2}>
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

          <Grid item xs={12} sm={6} md={2} sx={{ marginTop: '25px' }}>
            <Button
              ariaDescription={t('ariaLabel.searchButtonDescription')}
              disabled={disableSearch()}
              color={ButtonColorTypes.Secondary}
              variant={ButtonVariantTypes.Contained}
              testId="nameSearch"
              label={t('label.searchById')}
              onClick={fetchSltHistory}
              toolTip={t('toolTip.button.idSearch')}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        {displayTable ? (
          <SLTHistoryTableList updateList={onTriggerFunction} data={dataDetails} />
        ) : (
          <>
            <ShiftDataTest data={displayData} />

            <Grid container paddingTop={2} paddingBottom={2} justifyContent="right">
              <Grid item xs={12} sm={12} md={2}>
                <Button
                  color={ButtonColorTypes.Inherit}
                  variant={ButtonVariantTypes.Contained}
                  testId="projectClose"
                  label={t('label.close')}
                  onClick={handleClose}
                  toolTip={t('label.close')}
                />
              </Grid>
            </Grid>
          </>
        )}
      </Paper>

      {/* <Grid container paddingTop={2} paddingLeft={2} justifyContent="left">
        <Grid item xs={12} sm={12} md={1}>
          <Link to="/">
            <Button
              size={ButtonSizeTypes.Large}
              ariaDescription="Button for log tab"
              label={t('label.logButton')}
              testId="logButton"
              color={
                location.pathname === `/` ? ButtonColorTypes.Secondary : ButtonColorTypes.Inherit
              }
              variant={ButtonVariantTypes.Contained}
            />
          </Link>
        </Grid>
        <Grid item xs={12} sm={12} md={1}>
          <Link to="/history">
            <Button
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
      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        <Grid
          container
          paddingTop={2}
          paddingBottom={2}
          direction="row"
          justifyContent="space-evenly"
        >
          <Grid item xs={12} sm={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem label="Start Time">
                <DateTimePicker value={createdAfter} onChange={setCreatedAfter} format={"YYYY-MM-DD hh:mm"}/>
              </DemoItem>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem label="End Time">
                <DateTimePicker value={createdBefore} onChange={setCreatedBefore} format={"YYYY-MM-DD hh:mm"}/>
              </DemoItem>
            </LocalizationProvider>
          </Grid>

          <Grid paddingTop={2} item xs={12} sm={12} md={2}>
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

          <Grid item xs={12} sm={6} md={2} sx={{ marginTop: '25px' }}>
            <Button
              ariaDescription={t('ariaLabel.searchButtonDescription')}
              disabled={disableSearch()}
              color={ButtonColorTypes.Secondary}
              variant={ButtonVariantTypes.Contained}
              testId="nameSearch"
              label={t('label.searchById')}
              onClick={fetchSltHistory}
              toolTip={t('toolTip.button.idSearch')}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={12} sx={{ border: 1, margin: 1 }}>
        {dataDetails && Array.isArray(dataDetails) && dataDetails.length > 0 ? (
          <SLTHistoryTableList data={dataDetails} />
        ) : (
          <p style={{ fontWeight: 'bold', marginLeft: 15, alignItems: 'center' }} id="logNotFound">
            {t('msg.noLogsFound')}
          </p>
        )}
      </Paper> */}
    </>
  );
}

export default SLTHistory;

// show log messages from ODA in every 5 seconds. (Add API)
// add time filter in shift history page for searching shift wise data.
// add new page for showing Shift details on new page when clicked on shift ID (in Table).
// discuss about Shift ID format.
// make navigation buttons in tab form and show which page we are on.
// add header on comments section.
// show images in preview and when clicked it should show full image.
