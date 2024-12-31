import React from 'react';
import apiService from '../../../../services/apis';
import { shiftIdPath } from '../../../../utils/api_constants';

interface EntryFieldProps {
  shiftData;
  updatedList;
}

const ViewSLTHistoryByID = ({ shiftData, updatedList }: EntryFieldProps) => {
  const fetchSltHistoryByID = async () => {
    const path = shiftIdPath(shiftData.shift_id);
    const response = await apiService.getSltData(path);
    if (response.status === 200 && response.data && response.data.length > 0) {
      updatedList(response.data[0]);
    }
  };

  return (
    <span
      aria-hidden="true"
      data-testid={`shiftId${shiftData.id}`}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
      onClick={() => fetchSltHistoryByID()}
    >
      {shiftData.shift_id}
    </span>
  );
};

export default ViewSLTHistoryByID;
