/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {
  Button,
  ButtonColorTypes,
  ButtonVariantTypes,
  DataGrid
} from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';


interface EntryFieldProps {
  data: any;
}

const SLTLogTableList = ({ data }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  const ViewEB = ({ ebId }) => {
  
    const [openModal, setOpenModal] = useState(false);
  
    const handleCloseRequestResponse = () => {
      setOpenModal(false);
    };
  
    const handleOpen = () => {
      setOpenModal(true);
    };
  
     const RequestResponseDisplay = ({responseArray}) => (
      <div>
        {responseArray && responseArray.map((element) => (
          <>
            <p>
              <b> {t('ariaLabel.commandName')}:</b> {element.request}
            </p>
            <p>
              <b>{t('ariaLabel.status')}:</b> {element.status}
            </p>
            <p>
              <b>{t('ariaLabel.requestSentAt')}:</b> {element.request_sent_at}
            </p>
            <p>
              <b>{t('ariaLabel.details')}:</b> {element.status === 'OK' ? element.response.result : element.error.detail}
            </p>
            <hr />
          </>
        ))}
      </div>
    );
  
    return (
      <>
        {' '}
        <span
          id="shiftId"
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => handleOpen()}
        >
          {ebId.eb_id}
        </span>
        <Dialog
          aria-label={t('ariaLabel.dialog')}
          data-testid="dialogStatus"
          sx={{
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '1000px' // Set your width here
              }
            }
          }}
          open={openModal}
          onClose={handleCloseRequestResponse}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>EB Request Response</DialogTitle>
          <DialogContent dividers>
            <RequestResponseDisplay responseArray={ebId.request_responses} />
          </DialogContent>
          <DialogActions>
            <Button
              color={ButtonColorTypes.Inherit}
              variant={ButtonVariantTypes.Contained}
              testId="statusClose"
              label={t('label.close')}
              onClick={handleCloseRequestResponse}
              toolTip={t('label.close')}
            />
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  let id = 1;
  if(data){
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

      renderCell: (params) => <ViewEB ebId={params.row.info} />
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
