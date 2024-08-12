/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SLTHistoryDataModel from '../../Models/SLTHistory';
// import ViewSLTHistory from '../ViewSLTHistory/ViewSLTHistory';

const COLUMN_WIDTH = 200;

const ViewSLTHistory = ({ shiftData, updatedList }) => {
  const loadInfoPage = (shiftData) => {
    updatedList(shiftData);
  };
  return (
    <span
      id="shiftId"
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => loadInfoPage(shiftData)}
    >
      {shiftData.shift_id}
    </span>
  );
};

interface EntryFieldProps {
  data: SLTHistoryDataModel[];
  updateList: any;
}

const SLTHistoryTableList = ({ data, updateList }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  const onTriggerFunction = (data) => {
    updateList(data);
  };
  const columns = [
    {
      field: 'shift_id',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftId'),
      width: COLUMN_WIDTH,
      renderCell: (params) => (
        <ViewSLTHistory updatedList={onTriggerFunction} shiftData={params.row} />
      ),
    },
    {
      field: 'shift_start',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftStart'),
      width: COLUMN_WIDTH,
      renderCell: (params) => moment(params.row.shift_start).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'shift_end',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftEnd'),
      width: COLUMN_WIDTH,
      renderCell: (params) => moment(params.row.shift_end).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'operator_name',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.operatorName'),
      width: COLUMN_WIDTH,
      renderCell: (params) => params.row.shift_operator.name,
    },
  ];
  return (
    <Box data-testid="availableData" ml={4}>
      <DataGrid
        height={500}
        ariaDescription={t('ariaLabel.gridTableDescription')}
        ariaTitle={t('ariaLabel.gridTable')}
        data-testid={data}
        columns={columns}
        rows={data}
        testId="sltHistoryTable"
      />
    </Box>
  );
};

export default SLTHistoryTableList;
