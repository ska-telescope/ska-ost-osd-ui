/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import SLTHistoryDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  data: SLTHistoryDataModel[];
}

const SLTHistoryTableList = ({ data }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  let id = 1;
  data.map((row) => {
    row.id = id++;
    return row;
  });
  const columns = [
    {
      field: 'shift_start',
      headerName: t('label.shiftStart'),
      width: 150,
      renderCell: (params) => moment(params.row.shift_start).format('DD-MM-YYYY hh:MM:SS')
    },
    {
      field: 'shift_end',
      headerName: t('label.shiftEnd'),
      width: 150,
      renderCell: (params) => moment(params.row.shift_end).format('DD-MM-YYYY hh:MM:SS')
    },
    {
      field: 'operator_name',
      headerName: t('label.operatorName'),
      width: 180,
      renderCell: (params) => params.row.shift_operator.name
    },
    // {
    //   field: 'log_message',
    //   headerName: t('label.logMessage'),
    //   width: 220,
    //   renderCell: (params) => <ViewSLTHistory shiftData={params.row} />
    // },
    {
      field: 'comments',
      headerName: t('label.comments'),
      width: 220,
      renderCell: (params) => params.row.comments
    },
    {
      field: 'images',
      headerName: t('label.images'),
      width: 220,
      renderCell: (params) => params.row.status
    }
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
