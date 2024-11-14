import React from 'react';
import PreviewIcon from '@mui/icons-material/Preview';
import apiService from '../../../../services/apis';

interface EntryFieldProps {
  shiftData;
  updatedList;
}

const ViewSLTHistory = ({ shiftData, updatedList }: EntryFieldProps) => {
  const fetchSltHistoryByID = async () => {
    const path = `shift?shift_id=${shiftData.shift_id}`;
    const response = await apiService.getSltData(path);
    if (response.status === 200 && response.data && response.data.length > 0) {
      updatedList(response.data[0]);
    }
  };

  return (
    <PreviewIcon
      data-testid="iconViewShift"
      style={{ cursor: 'pointer', marginTop: '10px' }}
      onClick={() => fetchSltHistoryByID()}
    />
  );
};

export default ViewSLTHistory;
