import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<HomePage param={true} />} />
        <Route path="/cycle" element={<HomePage param={false} />} />
      </Routes>
    </Router>
  );
};

export default Routing;
