/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ViewSLTHistory from '../ViewSLTHistory/ViewSLTHistory';
import sltDataModel from '../../Models/sltDataModel';
import { toUTCDateTimeFormat } from '../../../utils/constants';

const COLUMN_WIDTH = 250;

interface EntryFieldProps {
  data: sltDataModel[];
  updateList: any;
}

const SLTHistoryTableList = ({ data, updateList }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  const onTriggerFunction = (Info) => {
    updateList(Info);
  };
  let id = 1;
  if (data && data.length > 0) {
    data.map((row) => {
      row.id = id++;
      return row;
    });
  }
  const columns = [
    {
      field: 'shift_id',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftId'),
      width: 350,
      renderCell: (params) => (
        <ViewSLTHistory updatedList={onTriggerFunction} shiftData={params.row} />
      )
    },
    {
      field: 'shift_start',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftStart'),
      width: COLUMN_WIDTH,
      renderCell: (params) =>
        params.row.shift_start ? toUTCDateTimeFormat(params.row.shift_start) : ''
    },
    {
      field: 'shift_end',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.shiftEnd'),
      width: COLUMN_WIDTH,
      renderCell: (params) =>
        params.row.shift_end ? toUTCDateTimeFormat(params.row.shift_end) : 'Current Shift'
    },
    {
      field: 'operator_name',
      headerClassName: 'super-app-theme--header',
      alignText: 'center',
      headerName: t('label.operatorName'),
      width: COLUMN_WIDTH,
      renderCell: (params) => params.row.shift_operator
    }
  ];
  return (
    <Box data-testid="availableData">
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
