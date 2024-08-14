/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid } from '@ska-telescope/ska-gui-components';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SLTLogDataModel from '../../Models/SLTLogs';

const ViewEB = ({ ebId }) => {
  const { t } = useTranslation('translations');

  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleOpen = () => {
    setOpenModal(true);
  };

  const RequestResponseDisplay = ({ responseArray }) => (
    <div>
      {responseArray.map((data) => (
        <>
          <p>
            <b>Command Name:</b> {data.request}
          </p>
          <p>
            <b>Status:</b> {data.status}
          </p>
          <p>
            <b>Request Sent at:</b> {data.request_sent_at}
          </p>
          <p>
            <b>Details:</b> {data.status == 'OK' ? data.response.result : data.error.detail}
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
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>EB Request Response</DialogTitle>
        <DialogContent dividers>
          <RequestResponseDisplay responseArray={ebId.request_responses} />
        </DialogContent>
      </Dialog>
    </>
  );
};

interface EntryFieldProps {
  data: SLTLogDataModel[];
}

const SLTLogTableList = ({ data }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  let id = 1;
  data &&
    data.map((row) => {
      row.id = id++;
      return row;
    });
  const columns = [
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

      renderCell: (params) => <ViewEB ebId={params.row.info} />
    },
    {
      field: 'info.sbi_status',
      headerName: t('label.currentStatus'),
      width: 220,

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
    <Box data-testid="availableData" ml={4}>
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
