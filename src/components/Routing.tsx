import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import CurrentShiftPage from '../pages/CurrentShiftPage/CurrentShiftPage';
import ShiftHistoryPage from '../pages/ShiftHistoryPage/ShiftHistoryPage';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<CurrentShiftPage />} />
        <Route path="/history" element={<ShiftHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default Routing;
