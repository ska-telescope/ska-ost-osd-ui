import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  DropDown
} from '@ska-telescope/ska-gui-components';
import AddIcon from '@mui/icons-material/Add';
import {
  SEARCH_TYPE,
  logSearchType,
  logTypeEnum,
  getUrlPath,
  getTodayDateRange,
  todayDate
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';
import ViewShiftData from './ViewShiftData';
import SearchByDates from './SearchComponenet/SearchByDates/SearchByDates';
import SearchByOperator from './SearchComponenet/SearchByOperator/SearchByOperator';
import SearchByStatus from './SearchComponenet/SearchByStatus/SearchByStatus';

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [dataDetails, setSltHistory] = useState([]);
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [operator, setOperator] = useState('');
  const [status, setStatus] = useState('');
  const [displayTable, setDisplayTable] = useState(true);
  const [displayData, setDisplayData] = useState('');
  const [searchType, setsearchType] = useState('');
  const [logSearchBy, setLogSearchBy] = useState(logTypeEnum.searchByDate);
  const location = useLocation();

  const fetchSltTodayShifts = async () => {
    const path = `shifts?query_type=created_between&shift_start=${getTodayDateRange.start}&shift_end=${getTodayDateRange.end}`;
    const result = await apiService.getSltData(path);
    if (result.status === 200) {
      setSltHistory(result.data[0]);
      setsearchType(SEARCH_TYPE.today);
    }
  };

  useEffect(() => {
    fetchSltTodayShifts();
  }, []);

  const message = () => (
    <div>
      {searchType === SEARCH_TYPE.today && (
        <div>
          <span id="msgToday">
            {t('msg.showTodayRecords')}
            {` (${t('dateFormatTwo', { date: new Date(todayDate) })})`}
          </span>
        </div>
      )}
      {searchType === SEARCH_TYPE.dates && createdAfter && createdBefore && (
        <p>
          {t('msg.selectedDates')}

          {` (Between ${t('dateFormatTwo', {
            date: new Date(createdAfter)
          })} and  ${t('dateFormatTwo', { date: new Date(createdBefore) })})`}
        </p>
      )}
      {searchType === SEARCH_TYPE.operator && (
        <div>
          <span id="msgOperator">
            {t('msg.showOperatorRecords')}
            &nbsp; {operator}
          </span>
        </div>
      )}
      {searchType === SEARCH_TYPE.status && (
        <div>
          <span id="msgStatus">
            {t('msg.showStatusRecords')}
            &nbsp;{status}
          </span>
        </div>
      )}
    </div>
  );

  const fetchSltHistoryByFilters = async (data) => {
    const path = getUrlPath(data);
    const response = await apiService.getSltData(path);
    if (response.status === 200 && response.data && response.data.length > 0) {
      setSltHistory(response.data[0]);
    } else {
      setSltHistory([]);
    }
  };

  const handleClose = () => {
    setDisplayTable(true);
  };

  const onTriggerFunction = (data) => {
    setDisplayTable(false);
    setDisplayData(data);
  };

  const getFilterCriteria = (data) => {
    if (data.createdAfter && data.createdBefore) {
      setsearchType(SEARCH_TYPE.dates);
      setCreatedAfter(data.createdAfter);
      setCreatedBefore(data.createdBefore);
    } else if (data.shift_operator) {
      setsearchType(SEARCH_TYPE.operator);
      setOperator(data.shift_operator);
    } else if (data.status) {
      setsearchType(SEARCH_TYPE.status);
      setStatus(data.status);
    }

    fetchSltHistoryByFilters(data);
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
      {displayTable ? (
        <Paper elevation={0} sx={{ border: 1, margin: 2, marginTop: 0 }}>
          <Grid container spacing={2} sx={{ padding: 2 }} justifyContent="left">
            <Grid item xs={12} sm={12} md={2}>
              <DropDown
                options={logSearchType}
                testId="logSearchBy"
                value={logSearchBy}
                setValue={setLogSearchBy}
                label={t('label.logSearchBy')}
                labelBold
              />
            </Grid>
            <Grid item xs={12} sm={12} md={1} />
            <Grid item xs={12} sm={12} md={9}>
              {displayTable && logSearchBy === logTypeEnum.searchByDate && (
                <SearchByDates setFilterCirteria={getFilterCriteria} />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchByOperator && (
                <SearchByOperator setFilterCirteria={getFilterCriteria} />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchByStatus && (
                <SearchByStatus setFilterCirteria={getFilterCriteria} />
              )}
            </Grid>
          </Grid>
        </Paper>
      ) : (
        ''
      )}
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
            <ViewShiftData data={displayData} />
          </>
        )}
      </Paper>
    </>
  );
}

export default SLTHistory;
