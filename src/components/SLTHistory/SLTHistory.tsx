import React, { useState } from 'react';
import { Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  DateEntry,
  DropDown
} from '@ska-telescope/ska-gui-components';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ENTITY, today, operatorName, makeUrlPath } from '../../utils/constants';
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
    if (displayButton === true) {
      return false;
    }
    return true;
  };

  const fetchSltHistory = async () => {
    const path = makeUrlPath('shifts', createdAfter, createdBefore);
    const result = await apiService.getSltData(path);
    setSltHistory(result.data);
  };

  const handleClose = () => {
    setDisplayTable(true);
    setDisplayButton(true);
  };

  const onTriggerFunction = (data) => {
    setDisplayTable(false);
    setDisplayData(data);
    setDisplayButton(false);
  };

  return (
    <>
      <Grid container padding={2} justifyContent="right">
        <Grid item xs={12} sm={12} md={10} />
        <Grid item xs={12} sm={12} md={1.9}>
          <Link to="/">
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
      <Paper sx={{ border: 1, margin: 4, marginTop: 2 }}>
        <Grid container paddingTop={2} justifyContent="left">
          <Grid paddingLeft={4} item xs={12} sm={12} md={3}>
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

          <Grid paddingLeft={10} item xs={12} sm={12} md={3}>
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
              testId="nameSearch"
              label={t('label.searchById')}
              onClick={fetchSltHistory}
              toolTip={t('toolTip.button.idSearch')}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ border: 1, margin: 4 }}>
        {displayTable ? (
          <SLTHistoryTableList updateList={onTriggerFunction} data={dataDetails} />
        ) : (
          <>
            <Paper sx={{ border: 1 }}>
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={12} md={4} />
                <Grid item xs={12} sm={12} md={4}>
                  <h3 style={{ fontWeight: 'bold', textAlign: 'center', alignItems: 'center' }}>
                    <b>Shift History Data </b>
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
