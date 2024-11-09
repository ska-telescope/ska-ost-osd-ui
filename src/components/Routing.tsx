import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import DisplayShiftComponent from '../pages/CurrentShiftPage/DisplayShiftComponent/DisplayShiftComponent';
import ShiftHistoryPage from '../pages/ShiftHistoryPage/ShiftHistoryPage';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<DisplayShiftComponent />} />
        <Route path="/history" element={<ShiftHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default Routing;
