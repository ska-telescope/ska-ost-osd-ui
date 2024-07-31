import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import SLTLogs from './SLTLogs/SLTLogs';


export const Routing = () => (
  <Router >
    <Routes>
      <Route path="/" element={<SLTLogs />} />
    </Routes>
  </Router>
);

export default Routing;
