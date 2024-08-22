import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  DateEntry
} from '@ska-telescope/ska-gui-components';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { today, makeUrlPath, nextdate, SEARCH_TYPE } from '../../utils/constants';

import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';
import ShiftDataTest from './ShiftData';

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [dataDetails, setSltHistory] = useState([]);
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [displayTable, setDisplayTable] = useState(true);
  const [displayButton, setDisplayButton] = useState(true);
  const [displayData, setDisplayData] = useState('');
  const [searchType, setsearchType] = useState('');
  const location = useLocation();

  const fetchSltTodayShifts = async () => {
    const path = makeUrlPath('shifts', today, nextdate);
    const result = await apiService.getSltData(path);
    setSltHistory(result.data);
    setsearchType(SEARCH_TYPE.today);
  };

  useEffect(() => {
    fetchSltTodayShifts();
  }, []);

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
    if (displayButton === true) {
      return false;
    }
    return true;
  };

  const message = () => (
    <div>
      {searchType === SEARCH_TYPE.today && (
        <div>
          <span id="msgToday">
            {t('msg.showTodayRecords')}
            <small>{` (${t('dateFormatTwo', { date: new Date(today) })})`}</small>
          </span>
        </div>
      )}
      {searchType === SEARCH_TYPE.dates && createdAfter && createdBefore && (
        <p>
          {t('msg.selectedDates')}
          <small>
            {` (Between ${t('dateFormatTwo', {
              date: new Date(createdAfter)
            })} and  ${t('dateFormatTwo', { date: new Date(createdBefore) })})`}
          </small>
        </p>
      )}
    </div>
  );

  const fetchSltHistory = async () => {
    const path = makeUrlPath('shifts', createdAfter, createdBefore);
    const result = await apiService.getSltData(path);
    setSltHistory(result.data);
    setsearchType(SEARCH_TYPE.dates);
  };

  const handleClose = () => {
    setDisplayTable(true);
    setDisplayButton(true);
    if (createdAfter && createdBefore) {
      fetchSltHistory();
    } else {
      fetchSltTodayShifts();
    }
  };

  const onTriggerFunction = (data) => {
    setDisplayTable(false);
    setDisplayData(data);
    setDisplayButton(false);
  };

  return (
    <>
      <Grid container sx={{ margin: 2, marginBottom: 0, marginTop: 0 }} justifyContent="end">
        <Grid item xs={12} sm={12} md={3}>
          <h2 data-testid="logHistoryLabel">{t('label.logHistoryTitle')}</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={7} />
        <Grid item xs={12} sm={12} md={2}>
          <Link to="/" style={{ color: ButtonColorTypes.Inherit }}>
            <Button
              icon={<AddIcon />}
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
      </Grid>
      <Paper sx={{ border: 1, margin: 2, marginTop: 0 }}>
        {displayTable ? (
          <Grid container spacing={2} padding={2} justifyContent="left">
            <Grid item xs={12} sm={12} md={3}>
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

            <Grid item xs={12} sm={12} md={3}>
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

            <Grid item xs={12} sm={12} md={1} />

            <Grid item xs={12} sm={6} md={3} sx={{ marginTop: '25px' }}>
              <Button
                icon={<SearchIcon />}
                ariaDescription={t('ariaLabel.searchButtonDescription')}
                disabled={disableSearch()}
                color={ButtonColorTypes.Secondary}
                variant={ButtonVariantTypes.Contained}
                testId="logHistorySearch"
                label={t('label.searchById')}
                onClick={fetchSltHistory}
                toolTip={t('toolTip.button.idSearch')}
              />
            </Grid>
          </Grid>
        ) : (
          ''
        )}
      </Paper>
      {displayTable ? <div style={{ marginLeft: '15px' }}>{message()}</div> : ''}
      <Paper sx={{ border: 1, margin: 2 }} data-testid="content">
        {displayTable ? (
          <SLTHistoryTableList updateList={onTriggerFunction} data={dataDetails} />
        ) : (
          <>
            <Paper>
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={12} md={4} />
                <Grid item xs={12} sm={12} md={4}>
                  <h3
                    id="viewHistoryTitle"
                    style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}
                  >
                    <b>{t('label.viewHistoryTitle')}</b>
                  </h3>
                </Grid>
                <Grid item xs={12} sm={12} md={3} />
                <Grid item xs={12} sm={12} md={1}>
                  <div style={{ float: 'right', padding: '15px' }}>
                    <Button
                      color={ButtonColorTypes.Inherit}
                      variant={ButtonVariantTypes.Contained}
                      testId="historyClose"
                      label={t('label.close')}
                      onClick={handleClose}
                      toolTip={t('label.close')}
                    />
                  </div>
                </Grid>
              </Grid>
            </Paper>
            <ShiftDataTest data={displayData} />
          </>
        )}
      </Paper>
    </>
  );
}

export default SLTHistory;
