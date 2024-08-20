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
