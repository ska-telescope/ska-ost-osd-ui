import React from 'react';
import apiService from '../../../../services/apis';
import { createShiftPath } from '../../../../utils/api_constants';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/shiftDataList';
import { USE_LOCAL_DATA } from '../../../../utils/constants';

interface EntryFieldProps {
  shiftData;
  updatedList;
}

const ViewSLTHistoryByID = ({ shiftData, updatedList }: EntryFieldProps) => {
  const useLocalData = () => {
    const result = SHIFT_DATA_LIST.filter((item) => item.shift_id === shiftData.shift_id);
    updatedList(result[0]);
  };
  const fetchSltHistoryByID = async () => {
    if (USE_LOCAL_DATA) {
      useLocalData();
      return true;
    }
    const path = createShiftPath(shiftData.shift_id, 'id');
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
