import React from 'react';
import PreviewIcon from '@mui/icons-material/Preview';
import apiService from '../../../../services/apis';
import { createShiftPath } from '../../../../utils/api_constants';
import SHIFT_DATA_LIST from '../../../../DataModels/DataFiles/ShiftDataList';
import { USE_LOCAL_DATA } from '../../../../utils/constants';

interface EntryFieldProps {
  shiftData;
  updatedList;
}

const ViewSLTHistory = ({ shiftData, updatedList }: EntryFieldProps) => {
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
    <PreviewIcon
      data-testid={`iconViewShift`}
      style={{ cursor: 'pointer', marginTop: '10px' }}
      onClick={() => fetchSltHistoryByID()}
    />
  );
};

export default ViewSLTHistory;
