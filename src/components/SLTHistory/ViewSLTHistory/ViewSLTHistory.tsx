/* eslint-disable jsx-a11y/no-static-element-interactions */
import ReactJson from 'react-json-view';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { DataGrid , Button, ButtonColorTypes, ButtonVariantTypes } from '@ska-telescope/ska-gui-components';
import { useTranslation } from 'react-i18next';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import apiService from '../../../services/apis';
import SLTDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  shiftData: SLTDataModel[];
}

const ViewSLTHistory = ({ shiftData }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setOpen(false);

  // console.log('shiftData', shiftData);

  let id = 1;
  shiftData.map((row) => {
    row.id = id++;
    return row;
  });

  const columns = [
    {
      field: 'info.eb_id',
      headerName: t('label.info'),
      width: 220,

      renderCell: (params) => params.row.eb_id
    },
    {
      field: 'sbi_status',
      headerName: t('label.currentStatus'),
      width: 100,
      renderCell: (params) => params.row.sbi_status
    },
    {
      field: 'sbi_ref',
      headerName: t('label.logTime'),
      width: 220,
      renderCell: (params) => params.row.sbi_ref
    }
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
        View Logs
      </span>
      <Dialog
        aria-label={t('ariaLabel.dialog')}
        data-testid="dialogEb"
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '1100px' // Set your width here
            }
          }
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
