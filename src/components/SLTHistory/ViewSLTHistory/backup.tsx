/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import {
  DataGrid,
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
} from '@ska-telescope/ska-gui-components';
import { useTranslation } from 'react-i18next';
import SLTDataModel from '../../Models/SLTHistory';
import moment from 'moment';

interface EntryFieldProps {
  shiftData: SLTDataModel[];
}

const ViewSLTHistory = ({ shiftData }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setOpen(false);

  console.log('shiftData', shiftData);

  // let id = 1;
  // shiftData.map((row) => {
  //   row.id = id++;
  //   return row;
  // });

  const columns = [
    {
      field: 'shift_id',
      headerName: t('label.shiftId'),
      width: 150,
      renderCell: (params) => shiftData.id,
    },
    {
      field: 'shift_start',
      headerName: t('label.shiftStart'),
      width: 150,
      renderCell: (params) => moment(shiftData.shift_start).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'shift_end',
      headerName: t('label.shiftEnd'),
      width: 150,
      renderCell: (params) => moment(shiftData.shift_end).format('DD-MM-YYYY hh:MM:SS'),
    },
    {
      field: 'operator_name',
      headerName: t('label.operatorName'),
      width: 180,
      renderCell: (params) => shiftData.shift_operator.name,
    },
    // {
    //   field: 'sbi_ref',
    //   headerName: t('label.logTime'),
    //   width: 220,
    //   renderCell: (params) => shiftData.sbi_ref
    // }
  ];
  const loadInfoPage = () => {
    setOpen(true);
  };
  return (
    <div>
      <span
        id="ebId"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => loadInfoPage()}
      >
        {shiftData.id}
      </span>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogEb"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1100px', // Set your width here
            },
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="historyDialogTitle">{t('label.logMessage')}</DialogTitle>
        <DialogContent dividers>
          <DataGrid
            ariaDescription={t('ariaLabel.gridTableDescription')}
            ariaTitle={t('ariaLabel.gridTable')}
            data-testid={data}
            columns={columns}
            rows={shiftData}
            testId="sltHistoryTable"
          />
        </DialogContent>
        <DialogActions>
          <Button
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="historyClose"
            label={t('label.close')}
            onClick={handleClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewSLTHistory;
