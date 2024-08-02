/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Container } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ViewSLT from '../ViewSLT/ViewSLT';
import SLTLogDataModel from '../../Models/SLTLogs';

interface EntryFieldProps {
  data: SLTLogDataModel[];
}

const SLTLogTableList = ({ data }: EntryFieldProps) => {
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
      field: 'source',
      headerName: t('label.source'),
      width: 100,
      renderCell: (params) => params.row.shift_operator
    },
    {
      field: 'info.eb_id',
      headerName: t('label.info'),
      width: 220,

      renderCell: (params) => params.row.info.eb_id
    },
    {
      field: 'sbi_status',
      headerName: t('label.currentStatus'),
      width: 100,
      renderCell: (params) => params.row.info.sbi_status
    },
    {
      field: 'log_time',
      headerName: t('label.logTime'),
      width: 220,
      renderCell: (params) => params.row.info.log_time
    }
  ];
  return (
    <Box data-testid="availableData" >
      <DataGrid
        ariaDescription={t('ariaLabel.gridTableDescription')}
        ariaTitle={t('ariaLabel.gridTable')}
        data-testid={data}
        columns={columns}
        rows={data}
        showBorder
        testId="sltLogTable"
      />
    </Box>
  );
};

export default SLTLogTableList;
