import { Grid } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DateEntry
} from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { today } from '../../../../utils/constants';

interface EntryFieldProps {
  setFilterCirteria;
}

const SearchByDates = ({ setFilterCirteria }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');

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
    if (createdAfter.length > 0 && createdBefore.length > 0 && !validateDates()) {
      return false;
    }
    return true;
  };
  const setDates = () => {
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
          onClick={setDates}
          toolTip={t('toolTip.button.idSearch')}
        />
      </Grid>
    </Grid>
  );
};

export default SearchByDates;
