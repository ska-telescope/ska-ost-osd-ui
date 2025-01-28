import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import DisplayShiftComponent from '../../pages/CurrentShiftPage/DisplayShiftComponent/DisplayShiftComponent';
import ShiftHistoryPage from '../../pages/ShiftHistoryPage/ShiftHistoryPage';
import { USE_LOCAL_DATA } from '../../utils/constants';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<DisplayShiftComponent isLocalData={USE_LOCAL_DATA} />} />
        <Route path="/history" element={<ShiftHistoryPage isLocalData={USE_LOCAL_DATA} />} />
      </Routes>
    </Router>
  );
};

export default Routing;
