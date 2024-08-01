import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Filters from '../Filters';
import Navigation from '../navigation';
import { Link, useLocation } from 'react-router-dom';
import {
  ENTITY,
  ENTITY_ID,
  SEARCH_TYPE,
  createdAfterDate,
  createdBeforeDate,
  last7days,
  nextdate,
    today,
  makeUrlPath
} from '../../utils/constants';
import { Chip, Grid } from '@mui/material';
import {
    Button,
    ButtonColorTypes,
    ButtonVariantTypes,
    DateEntry,
    SearchEntry
  } from '@ska-telescope/ska-gui-components';


import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';

interface EntryFieldProps {
  id: string;
  createdBefore: string;
  createdAfter: string;
}

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [searchType, setSearchType] = useState<string>(SEARCH_TYPE.last7days);
  const [createdAfter, setCreatedAfter] = useState<string>('');
  const [createdBefore, setCreatedBefore] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [dataDetails, setExecutionBlock] = useState([]);
  const [filter, setFilter] = useState(null);
  const { state } = useLocation();

//   useEffect(() => {
//     if (filterstate) {
//       setId(filterstate.value);
//       const filterStates = {
//         id: filterstate.value
//       };
//       onData(filterStates);
//     }
//   }, []);

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

  const searchById = type => {
    setSearchType(type);
    const filterStates = {
      id
    };
    // onData(filterStates);
  };

//   const searchByLast7Days = type => {
//     setSearchType(type);
//     const filterStates = {
//       createdAfter: createdAfterDate,
//       createdBefore: createdBeforeDate
//     };
//     onData(filterStates);
//   };

//   const searchByToday = type => {
//     setSearchType(type);
//     const filterStates = {
//       createdAfter: today,
//       createdBefore: nextdate
//     };
//     onData(filterStates);
//   };

  const searchByDates = type => {
    setSearchType(type);
    const filterStates = {
      createdAfter,
      createdBefore
    };
    // onData(filterStates);
  };

//   const fetchExecutionBlock = async data => {
//     const baseURL = makeUrlPath(data.id, data.createdBefore, data.createdAfter, ENTITY.shift);
//   };

//   useEffect(() => {
//     if (!state) {
//       fetchExecutionBlock(last7days);
//     }
//   }, []);

//   const handleData = async (data: EntryFieldProps) => {
//     fetchExecutionBlock(data);
//     setFilter(data);
//   };

//   const onTriggerFunction = () => {
//     const filterStates = {
//       createdAfter: createdAfterDate,
//       createdBefore: createdBeforeDate
//     };
//     if (filter) {
//       fetchExecutionBlock(filter);
//     } else {
//       fetchExecutionBlock(filterStates);
//     }
//   };
  return (
    <>
    <Grid container padding={4} paddingTop={2} direction="row" justifyContent="space-evenly">

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

    <Grid item xs={12} sm={6} md={2}>
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
     
    </>
  );
}

export default SLTHistory;
