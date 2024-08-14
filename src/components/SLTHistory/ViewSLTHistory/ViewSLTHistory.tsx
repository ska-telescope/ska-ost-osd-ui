/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useTranslation } from 'react-i18next';
import SLTDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  shiftData: SLTDataModel;
  updateStatus;
}

const ViewSLTHistory = ({ shiftData, updateStatus }: EntryFieldProps) => {
  const { t } = useTranslation('translations');

  const columns = [
    {
      field: 'shift_id',
      headerName: t('label.shiftId'),
      width: 150,
      renderCell: (params) => shiftData.id
    },
    {
      field: 'shift_start',
      headerName: t('label.shiftStart'),
      width: 150,
      renderCell: (params) => shiftData.shift_start
    },
    {
      field: 'shift_end',
      headerName: t('label.shiftEnd'),
      width: 150,
      renderCell: (params) => shiftData.shift_end
    },
    {
      field: 'operator_name',
      headerName: t('label.operatorName'),
      width: 180,
      renderCell: (params) => shiftData.shift_operator.name
    }
  ];
  const loadInfoPage = () => {
    updateStatus();
  };
  return (
    <div>
      <span
        id="shiftId"
        style={{ cursor: 'pointer', textDecoration: 'underline' }}
        onClick={() => loadInfoPage()}
      >
        {shiftData.id}
      </span>
    </div>
  );
};

export default ViewSLTHistory;
