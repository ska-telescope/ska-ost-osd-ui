import { Grid } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonSizeTypes,
  ButtonVariantTypes,
  DateEntry
} from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { getFormatedDate, getUTCDateRange, todayDate } from '../../../../utils/constants';

interface EntryFieldProps {
  setFilterCirteria;
  searchFilter;
}

const SearchByDates = ({ setFilterCirteria, searchFilter }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [startDate, setStartDate] = useState(
    searchFilter && searchFilter.createdAfter
      ? getFormatedDate(searchFilter.createdAfter)
      : todayDate
  );
  const [endDate, setEndDate] = useState(
    searchFilter && searchFilter.createdBefore
      ? getFormatedDate(searchFilter.createdBefore)
      : todayDate
  );

  const validateDates = () => {
    if (
      Date.parse(startDate) > Date.parse(todayDate) ||
      Date.parse(endDate) > Date.parse(todayDate)
    ) {
      return t('msg.errFutureDate');
    }
    if (Date.parse(startDate) > Date.parse(endDate)) {
      return t('msg.errInvalidDate');
    }
    return '';
  };
  const disableSearch = () => {
    if (startDate.length > 0 && endDate.length > 0 && !validateDates()) {
      return false;
    }
    return true;
  };
  const setDates = () => {
    const getDatedRange = getUTCDateRange(startDate, endDate);
    const createdAfter = getDatedRange.start;
    const createdBefore = getDatedRange.end;
    const emmitData = {
      createdAfter,
      createdBefore
    };
    setFilterCirteria(emmitData);
  };
  return (
    <Grid container spacing={2} justifyContent="left" sx={{ marginTop: '-32px' }}>
      <Grid item xs={12} sm={12} md={3}>
        <DateEntry
          ariaDescription={t('ariaLabel.dateDescription')}
          ariaTitle={t('ariaLabel.date')}
          helperText={t('msg.requiredStartDate')}
          testId="dateEntryStart"
          // errorText={validateDates()}
          label={t('label.startDate')}
          value={startDate}
          setValue={setStartDate}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={3}>
        <DateEntry
          ariaDescription={t('ariaLabel.dateDescription')}
          ariaTitle={t('ariaLabel.date')}
          helperText={t('msg.requiredEndDate')}
          testId="dateEntryEnd"
          // errorText={validateDates()}
          label={t('label.endDate')}
          value={endDate}
          setValue={setEndDate}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={1} />

      <Grid item xs={12} sm={6} md={3} sx={{ marginTop: '30px' }}>
        <Button
          size={ButtonSizeTypes.Small}
          icon={<SearchIcon />}
          ariaDescription={t('ariaLabel.searchButtonDescription')}
          disabled={disableSearch()}
          color={ButtonColorTypes.Secondary}
          variant={ButtonVariantTypes.Contained}
          testId="logHistorySearch"
          label={t('label.searchById')}
          onClick={setDates}
          toolTip={t('toolTip.button.idSearch')}
        />
      </Grid>
    </Grid>
  );
};

export default SearchByDates;
