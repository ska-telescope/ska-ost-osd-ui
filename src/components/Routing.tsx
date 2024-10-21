import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import SLTHistory from './SLTHistory/SLTHistory';
import CurrentActiveShift from './SLTLogs/CurrentActiveShift';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<CurrentActiveShift />} />
        <Route path="/history" element={<SLTHistory />} />
      </Routes>
    </Router>
  );
};

export default Routing;
