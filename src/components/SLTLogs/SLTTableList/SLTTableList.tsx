/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import EBRequestResponse from '../EBRequestResponse';

interface EntryFieldProps {
  data: any;
  updatedList: any;
}

const SLTLogTableList = ({ data, updatedList }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  const onTriggerFunction = (ebData) => {
    updatedList(ebData);
  };

  let id = 1;
  if (data) {
    data.map((row) => {
      row.id = id++;
      return row;
    });
  }
  const columns = [
    {
      field: 'source',
      headerName: t('label.source'),
      width: 120,
      renderCell: (params) => params.row.shift_operator
    },
    {
      field: 'info.eb_id',
      headerName: t('label.info'),
      width: 220,
      renderCell: (params) => (
        <EBRequestResponse updatedStatus={onTriggerFunction} ebData={params.row.info} />
      )
    },
    {
      field: 'info.sbi_status',
      headerName: t('label.currentStatus'),
      width: 150,

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
    <Box data-testid="availableData">
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
