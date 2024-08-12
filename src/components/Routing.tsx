import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import SLTLogs from './SLTLogs/SLTLogs';
import SLTHistory from './SLTHistory/SLTHistory';
import ShiftData from './SLTHistory/SLTHistory';
import ShiftDataTest from './SLTHistory/ShiftData';

export const Routing = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SLTLogs />} />
      <Route path="/history" element={<SLTHistory />} />
      <Route path="/shifts" element={<ShiftDataTest />} />
    </Routes>
  </Router>
);

export default Routing;
