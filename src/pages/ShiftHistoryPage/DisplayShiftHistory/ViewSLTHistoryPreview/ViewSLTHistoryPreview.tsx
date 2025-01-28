import React from 'react';
import View from '@mui/icons-material/VisibilityRounded';
import apiService from '../../../../services/apis';
import { createShiftPath } from '../../../../utils/api_constants';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/ShiftDataList';

interface EntryFieldProps {
  shiftData;
  updatedList;
  isLocalData;
}

const ViewSLTHistory = ({ shiftData, updatedList, isLocalData }: EntryFieldProps) => {
  const useLocalData = () => {
    const result = SHIFT_DATA_LIST.filter((item) => item.shift_id === shiftData.shift_id);
    updatedList(result[0]);
  };

  const fetchSltHistoryByID = async () => {
    if (isLocalData) {
      useLocalData();
    } else {
      const path = createShiftPath(shiftData.shift_id, 'id');
      const response = await apiService.getSltData(path);
      if (response.status === 200) {
        updatedList(response.data[0]);
      }
    }
  };

  return (
    <View
      data-testid={`iconViewShift`}
      style={{ cursor: 'pointer', marginTop: '10px' }}
      onClick={() => fetchSltHistoryByID()}
    />
  );
};

export default ViewSLTHistory;
