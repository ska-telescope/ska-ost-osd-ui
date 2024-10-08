import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import SLTLogs from './SLTLogs/SLTLogs';
import SLTHistory from './SLTHistory/SLTHistory';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<SLTLogs />} />
        <Route path="/history" element={<SLTHistory />} />
      </Routes>
    </Router>
  );
};

export default Routing;
