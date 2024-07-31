import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import Filters from '../Filters';
import Navigation from '../navigation';
import {
  ENTITY,
  ENTITY_ID,
  createdAfterDate,
  createdBeforeDate,
  last7days,
  makeUrlPath
} from '../../utils/constants';

import apiService from '../../services/apis';
import SLTHistoryTableList from './SLTHistoryTableList/SLTHistoryTable';

interface EntryFieldProps {
  id: string;
  createdBefore: string;
  createdAfter: string;
}

function SLTHistory() {
  const { t } = useTranslation('translations');
  const [dataDetails, setExecutionBlock] = useState([]);
  const [filter, setFilter] = useState(null);
  const { state } = useLocation();
  const fetchExecutionBlock = async data => {
    const baseURL = makeUrlPath(data.id, data.createdBefore, data.createdAfter, ENTITY.shift);
  };

  useEffect(() => {
    if (!state) {
      fetchExecutionBlock(last7days);
    }
  }, []);

  const handleData = async (data: EntryFieldProps) => {
    fetchExecutionBlock(data);
    setFilter(data);
  };

  const onTriggerFunction = () => {
    const filterStates = {
      createdAfter: createdAfterDate,
      createdBefore: createdBeforeDate
    };
    if (filter) {
      fetchExecutionBlock(filter);
    } else {
      fetchExecutionBlock(filterStates);
    }
  };
  return (
    <>
      <Navigation />
      <Box sx={{ marginTop: 2 }} data-testid="content">
        <Filters onData={handleData} filterstate={state} />
        <div>
          {dataDetails && Array.isArray(dataDetails) && dataDetails.length > 0 ? (
            <SLTHistoryTableList updatedList={onTriggerFunction} data={dataDetails} />
          ) : (
            <p id="ebNotFound">{t('msg.noEbRecordsFound')}</p>
          )}
        </div>
      </Box>
    </>
  );
}

export default SLTHistory;
