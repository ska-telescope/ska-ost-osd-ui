import React from 'react';
import SLTHistoryDataModel from '../../Models/SLTHistory';

interface EntryFieldProps {
  shiftData: SLTHistoryDataModel;
  updatedList;
}

const ViewSLTHistory = ({ shiftData, updatedList }: EntryFieldProps) => {
  const loadInfoPage = () => {
    updatedList();
  };
  return (
    <span
      aria-hidden="true"
      onKeyDown={() => loadInfoPage()}
      id="shiftId"
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => loadInfoPage()}
    >
      {shiftData.id}
    </span>
  );
};

export default ViewSLTHistory;
