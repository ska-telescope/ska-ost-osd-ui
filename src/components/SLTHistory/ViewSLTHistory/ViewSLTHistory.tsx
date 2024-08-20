import React from 'react';
import SLTHistoryDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  shiftData: SLTHistoryDataModel;
  updatedList;
}

const ViewSLTHistory = ({ shiftData, updatedList }: EntryFieldProps) => {
  const loadInfoPage = () => {
    updatedList(shiftData);
  };
  return (
    <span
      aria-hidden="true"
      onKeyDown={() => loadInfoPage()}
      id="shiftId"
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => loadInfoPage()}
    >
      {shiftData.shift_id}
    </span>
  );
};

export default ViewSLTHistory;
