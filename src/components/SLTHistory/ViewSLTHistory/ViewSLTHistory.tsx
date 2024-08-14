/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import SLTHistoryDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  shiftData: SLTHistoryDataModel;
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
      renderCell: (params) => moment(shiftData.shift_start).format('DD-MM-YYYY hh:MM:SS')
    },
    {
      field: 'shift_end',
      headerName: t('label.shiftEnd'),
      width: 150,
      renderCell: (params) => moment(shiftData.shift_end).format('DD-MM-YYYY hh:MM:SS')
    },
    {
      field: 'operator_name',
      headerName: t('label.operatorName'),
      width: 180,
      renderCell: (params) => shiftData.shift_operator.name
    }
    // {
    //   field: 'sbi_ref',
    //   headerName: t('label.logTime'),
    //   width: 220,
    //   renderCell: (params) => shiftData.sbi_ref
    // }
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
