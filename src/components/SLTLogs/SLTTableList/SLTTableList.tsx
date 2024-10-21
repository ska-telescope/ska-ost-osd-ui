/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ShiftLogs from '../ShiftLogs';

interface EntryFieldProps {
  data: any;
}

const SLTLogTableList = ({ data }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  let id = 1;
  if (data) {
    data.map((row) => {
      row.id = id++;
      return row;
    });
  }
  const columns = [
    {
      field: 'shiftLogs',
      headerName: t('label.info'),
      width: 220,
      renderCell: (params) => <ShiftLogs logData={params.row} />
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
