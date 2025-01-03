import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
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
import ViewShiftData from './ViewShiftData/ViewShiftData';
import SearchByEbId from './SearchComponent/SearchByEbId/SearchByEb';
import SearchBySbiId from './SearchComponent/SearchBySbiId/SearchBySbi';
import SearchByDates from './SearchComponent/SearchByDates/SearchByDates';
import SearchByOperator from './SearchComponent/SearchByOperator/SearchByOperator';
import SearchByStatus from './SearchComponent/SearchByStatus/SearchByStatus';
import ShiftHistoryListComponent from './DisplayShiftHistory/ShiftHistoryListComponent/ShiftHistoryListComponent';

function ShiftHistoryPage() {
  const { t } = useTranslation('translations');
  const [dataDetails, setSltHistory] = useState([]);
  const [searchFilterData, setSearchFilterData] = useState(null);

  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [operator, setOperator] = useState('');
  const [status, setStatus] = useState('');
  const [eb_id, setEb] = useState('');
  const [sbi_id, setSbi] = useState('');
  const [displayTable, setDisplayTable] = useState(true);
  const [displayData, setDisplayData] = useState(null);
  const [searchType, setSearchType] = useState('');
  const [logSearchBy, setLogSearchBy] = useState(logTypeEnum.searchByDate);
  const location = useLocation();

  const fetchSltTodayShifts = async () => {
    const path = `shifts?query_type=created_between&shift_start=${getTodayDateRange.start}&shift_end=${getTodayDateRange.end}`;
    const result = await apiService.getSltData(path);
    if (result.status === 200) {
      setSltHistory(result.data[0].reverse());
      setSearchType(SEARCH_TYPE.today);
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
      {searchType === SEARCH_TYPE.eb_id && (
        <div>
          <span id="msgStatus">
            {t('msg.showStatusRecords')}
            &nbsp;{eb_id}
          </span>
        </div>
      )}
      {searchType === SEARCH_TYPE.sbi_id && (
        <div>
          <span id="msgStatus">
            {t('msg.showStatusRecords')}
            &nbsp;{sbi_id}
          </span>
        </div>
      )}
    </div>
  );

  const fetchSltHistoryByFilters = async (data) => {
    const path = getUrlPath(data);
    const response = await apiService.getSltData(path);
    if (response.status === 200 && response.data && response.data.length > 0) {
      setSltHistory(response.data[0].reverse());
    } else {
      setSltHistory([]);
    }
  };

  const handleClose = () => {
    setDisplayTable(true);
    if (searchFilterData) fetchSltHistoryByFilters(searchFilterData);
    else {
      fetchSltTodayShifts();
    }
  };

  const onTriggerFunction = (data) => {
    setDisplayTable(false);
    setDisplayData(data);
  };

  const getFilterCriteria = (data) => {
    setSearchFilterData(data);
    if (data.createdAfter && data.createdBefore) {
      setSearchType(SEARCH_TYPE.dates);
      setCreatedAfter(data.createdAfter);
      setCreatedBefore(data.createdBefore);
    } else if (data.shift_operator) {
      setSearchType(SEARCH_TYPE.operator);
      setOperator(data.shift_operator);
    } else if (data.status) {
      setSearchType(SEARCH_TYPE.status);
      setStatus(data.status);
    } else if (data.eb_id) {
      setSearchType(SEARCH_TYPE.eb_id);
      setEb(data.eb_id);
    } else if (data.sbi_id) {
      setSearchType(SEARCH_TYPE.sbi_id);
      setSbi(data.sbi_id);
    }

    fetchSltHistoryByFilters(data);
  };

  return (
    <>
      <Box sx={{ marginLeft: 2, marginTop: 0, marginBottom: 0 }}>
        <Grid container justifyContent="end">
          <Grid item xs={12} sm={12} md={3}>
            <h2 style={{ margin: 0, marginBottom: '10px' }} data-testid="logHistoryLabel">
              {t('label.logHistoryTitle')}
            </h2>
          </Grid>
          <Grid item xs={12} sm={12} md={7} />
          <Grid item xs={12} sm={12} md={2}>
            <Link to="/" style={{ color: ButtonColorTypes.Inherit }}>
              <Button
                icon={<AddIcon />}
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
      </Box>

      {displayTable ? (
        <Paper elevation={0} sx={{ border: '1px solid darkgrey', margin: 1, marginTop: 2 }}>
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
                <SearchByDates
                  searchFilter={searchFilterData}
                  setFilterCriteria={getFilterCriteria}
                />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchByOperator && (
                <SearchByOperator
                  searchFilter={searchFilterData}
                  setFilterCriteria={getFilterCriteria}
                />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchByStatus && (
                <SearchByStatus
                  searchFilter={searchFilterData}
                  setFilterCriteria={getFilterCriteria}
                />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchByEbId && (
                <SearchByEbId
                  searchFilter={searchFilterData}
                  setFilterCirteria={getFilterCriteria}
                />
              )}
              {displayTable && logSearchBy === logTypeEnum.searchBySbiId && (
                <SearchBySbiId
                  searchFilter={searchFilterData}
                  setFilterCirteria={getFilterCriteria}
                />
              )}
            </Grid>
          </Grid>
        </Paper>
      ) : (
        ''
      )}
      {displayTable ? <div style={{ marginLeft: '15px' }}>{message()}</div> : ''}
      <Paper sx={{ border: '1px solid darkgrey', margin: 1 }} data-testid="content">
        {displayTable ? (
          <ShiftHistoryListComponent updateList={onTriggerFunction} data={dataDetails} />
        ) : (
          <>
            <Paper>
              <Grid container justifyContent="left">
                <Grid item xs={12} sm={12} md={1} padding={1}>
                  <Button
                    size={ButtonSizeTypes.Small}
                    color={ButtonColorTypes.Inherit}
                    variant={ButtonVariantTypes.Contained}
                    testId="historyClose"
                    label={t('label.back')}
                    onClick={handleClose}
                    toolTip={t('label.back')}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={3} />
                <Grid item xs={12} sm={12} md={4}>
                  <Typography
                    data-testid="viewHistoryTitle"
                    style={{
                      margin: '10PX',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <b>
                      {t('label.viewShift')}: {displayData.shift_id}{' '}
                    </b>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={4} />
              </Grid>
            </Paper>
            <ViewShiftData data={displayData} />
          </>
        )}
      </Paper>
    </>
  );
}

export default ShiftHistoryPage;
