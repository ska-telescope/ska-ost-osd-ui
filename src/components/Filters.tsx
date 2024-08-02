import { Chip, Grid } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DateEntry,
  SearchEntry
} from '@ska-telescope/ska-gui-components';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {
  SEARCH_TYPE,
  createdAfterDate,
  createdBeforeDate,
  nextdate,
  today
} from '../utils/constants';

interface FilterProps {
  value: string;
}

interface EntryFieldProps {
  filterstate: FilterProps;
  onData: Function;
}

const Filters = ({ filterstate, onData }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [searchType, setSearchType] = useState<string>(SEARCH_TYPE.last7days);
  const [createdAfter, setCreatedAfter] = useState<string>('');
  const [createdBefore, setCreatedBefore] = useState<string>('');
  const [id, setId] = useState<string>('');
  useEffect(() => {
    if (filterstate) {
      setId(filterstate.value);
      const filterStates = {
        id: filterstate.value
      };
      onData(filterStates);
    }
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

  const searchById = (type) => {
    setSearchType(type);
    const filterStates = {
      id
    };
    onData(filterStates);
  };

  const searchByLast7Days = (type) => {
    setSearchType(type);
    const filterStates = {
      createdAfter: createdAfterDate,
      createdBefore: createdBeforeDate
    };
    onData(filterStates);
  };

  const searchByToday = (type) => {
    setSearchType(type);
    const filterStates = {
      createdAfter: today,
      createdBefore: nextdate
    };
    onData(filterStates);
  };

  const searchByDates = (type) => {
    setSearchType(type);
    const filterStates = {
      createdAfter,
      createdBefore
    };
    onData(filterStates);
  };

  const disableDateSearch = () => {
    if (validateDates() === '' && createdAfter !== '' && createdBefore !== '') {
      return false;
    }
    return true;
  };

  const disableIdSearch = () => {
    if (id !== '') {
      return false;
    }
    return true;
  };

  const message = () => (
    <div>
      {searchType === SEARCH_TYPE.today && (
        <div>
          <span id="msgToday">
            {t('msg.today')}
            <small>{` (${t('date_format_two', { date: new Date(today) })})`}</small>
          </span>
        </div>
      )}
      {searchType === SEARCH_TYPE.last7days && (
        <span id="msgLastWeek">
          {t('msg.last7days')}
          <small>
            {` (Between ${t('date_format_two', {
              date: new Date(createdAfterDate)
            })} and  ${t('date_format_two', { date: new Date(createdBeforeDate) })})`}
          </small>
        </span>
      )}
      {searchType === SEARCH_TYPE.dates && createdAfter && createdBefore && (
        <p>
          {t('msg.selectedDates')}
          <small>
            {` (Between ${t('date_format_two', {
              date: new Date(createdAfter)
            })} and  ${t('date_format_two', { date: new Date(createdBefore) })})`}
          </small>
        </p>
      )}
      {searchType === SEARCH_TYPE.id && (
        <p>
          {t('msg.fuzzySearchById')}
          <small>{` "${id} "`}</small>
        </p>
      )}
    </div>
  );

  return (
    <>
      <Grid container spacing={2} justifyContent="left">
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
        <Grid item xs={12} sm={6} md={2} sx={{ marginTop: '25px' }}>
          <Button
            ariaDescription={t('ariaLabel.searchButtonDescription')}
            disabled={disableDateSearch()}
            color={ButtonColorTypes.Secondary}
            variant={ButtonVariantTypes.Contained}
            testId="dateSearch"
            label={t('label.searchByDates')}
            onClick={() => searchByDates(SEARCH_TYPE.dates)}
            toolTip={t('toolTip.button.dateSearch')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={1} />
        <Grid item xs={12} sm={6} md={3}>
          <SearchEntry
            ariaDescription={t('ariaLabel.textDescription')}
            ariaTitle={t('ariaLabel.text')}
            label={t('label.searchById')}
            testId="searchId"
            value={id}
            helperText={t('msg.requiredEntityId')}
            setValue={setId}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2} sx={{ marginTop: '25px' }}>
          <Button
            ariaDescription={t('ariaLabel.searchButtonDescription')}
            disabled={disableIdSearch()}
            color={ButtonColorTypes.Secondary}
            variant={ButtonVariantTypes.Contained}
            testId="idSearch"
            label={t('label.searchById')}
            onClick={() => searchById(SEARCH_TYPE.id)}
            toolTip={t('toolTip.button.idSearch')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ paddingTop: 2 }} justifyContent="left">
        <Grid item xs={12} sm={12} md={5}>
          <div>{message()}</div>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Chip
            aria-label={t('ariaLabel.searchButton')}
            color={searchType === SEARCH_TYPE.last7days ? 'secondary' : 'default'}
            data-testid="chipLastWeak"
            label={t('label.last7days')}
            onClick={() => searchByLast7Days(SEARCH_TYPE.last7days)}
          />
          <Chip
            aria-label={t('ariaLabel.searchButton')}
            color={searchType === SEARCH_TYPE.today ? 'secondary' : 'default'}
            data-testid="chipToday"
            label={t('label.today')}
            onClick={() => searchByToday(SEARCH_TYPE.today)}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Filters;
