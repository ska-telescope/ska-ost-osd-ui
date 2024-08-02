/* eslint-disable jsx-a11y/no-static-element-interactions */
import ReactJson from 'react-json-view';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonColorTypes, ButtonVariantTypes } from '@ska-telescope/ska-gui-components';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from 'react-router-dom';
import { ENTITY } from '../../../utils/constants';
import apiService from '../../../services/apis';
import SLTDataModel from '../../Models/SLTLogs';

interface EntryFieldProps {
  shiftId: string;
  info: SLTDataModel;
}

const ViewEB = ({ shiftId, info }: EntryFieldProps) => {
  const { t } = useTranslation('translations');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setOpen(false);

  const fetchData = async () => {
    const baseURL = `${ENTITY.shift}/${shiftId}`;
    if (shiftId && info === null) {
      const response = await apiService.getEntityData(baseURL);
      setData(response.data);
      setOpen(true);
    }
  };
  const getEbDetails = () => {
    if (shiftId && info === null) {
      fetchData();
    } else {
      setData(info);
      setOpen(true);
    }
  };
  const loadEntityPage = (value) => {
    navigate('/ebs', { state: { value } });
  };
  return (
    <div>
      {shiftId && shiftId !== '' && info === null ? (
        <span
          id="shiftId"
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => loadEntityPage(shiftId)}
        >
          {shiftId}
        </span>
      ) : (
        <PreviewIcon
          aria-label={t('ariaLabel.view')}
          id="iconViewEB"
          style={{ cursor: 'pointer', marginTop: '14px' }}
          onClick={getEbDetails}
        />
      )}
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
        <DialogTitle id="ebDialogTitle">{t('label.eb_info')}</DialogTitle>
        <DialogContent dividers>
          <ReactJson enableClipboard={false} src={data} />
        </DialogContent>
        <DialogActions>
          <Button
            color={ButtonColorTypes.Inherit}
            variant={ButtonVariantTypes.Contained}
            testId="ebClose"
            label={t('label.close')}
            onClick={handleClose}
            toolTip={t('label.close')}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewEB;
