/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SLTHistoryDataModel from '../../Models/SLTHistory';
import ViewSLTHistory from '../ViewSLTHistory/ViewSLTHistory';

interface EntryFieldProps {
  data: SLTHistoryDataModel[];
}

const SLTHistoryTableList = ({ data }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  // let shift_id = 1;
  // data.map((row) => {
  //   row.shift_id = shift_id++;
  //   return row;
  // });
  const columns = [
    {
      field: 'shift_id',
      headerName: t('label.shiftId'),
      width: 150,
      renderCell: (params) => <ViewSLTHistory shiftData={params.row} />,
    },
    {
      field: 'shift_start',
      headerName: t('label.shiftStart'),
      width: 150,
      renderCell: (params) => moment(params.row.shift_start).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'shift_end',
      headerName: t('label.shiftEnd'),
      width: 150,
      renderCell: (params) => moment(params.row.shift_end).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'operator_name',
      headerName: t('label.operatorName'),
      width: 180,
      renderCell: (params) => params.row.shift_operator.name,
    },
  ];
  return (
    <Box data-testid="availableData" m={1}>
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
