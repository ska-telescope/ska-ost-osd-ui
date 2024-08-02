import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DateEntry,
  DropDown
} from '@ska-telescope/ska-gui-components';
import SLTHistoryMockList from '../../mockData/SLTHistoryMock';
import {
  ENTITY,
  operatorName,
  today,
  makeUrlPath
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [createdAfter, setCreatedAfter] = useState<string>('');
  const [createdBefore, setCreatedBefore] = useState<string>('');
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
    if (operator !== '') {
      return false;
    }
    return true;
  };

  const searchShiftHistory = () => {

    const shiftSearchData = {
      shift_operator: operator,
      start_time: createdAfter,
      end_time: createdBefore
    };

    // console.log('shiftSearchData', shiftSearchData);
    // const baseURL = `/shift`;
    // const response = apiService.getShiftData(baseURL);

  };


  return (
    <>
    <Paper elevation={12} sx={{"border":1, "margin": 1}}>
      <Grid container paddingTop={2} direction="row" justifyContent="space-evenly">
        <Grid item paddingTop={4} xs={12} sm={12} md={2}>
          <Link to="/">
            <Button
              ariaDescription="Button for log tab"
              label={t('label.logButton')}
              testId="logButton"
              color={
                location.pathname === `/${ENTITY.shiftLog}`
                  ? ButtonColorTypes.Secondary
                  : ButtonColorTypes.Inherit
              }
              variant={ButtonVariantTypes.Contained}
            />
          </Link>
        </Grid>

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
            onClick={searchShiftHistory}
            toolTip={t('toolTip.button.idSearch')}
          />
        </Grid>
      </Grid>
      </Paper>

      <Paper elevation={12} sx={{"border":1, "margin": 1}}>

        {SLTHistoryMockList &&
        Array.isArray(SLTHistoryMockList) &&
        SLTHistoryMockList.length > 0 ? (
          <SLTHistoryTableList data={SLTHistoryMockList} />
        ) : (
          <p id="logNotFound">{t('msg.noLogsFound')}</p>
        )}
      </Paper>
    </>
  );
}

export default SLTHistory;
