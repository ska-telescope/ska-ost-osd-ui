import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import App from '../App/App';

export const Routing = () => {
  const basename = window.env?.BASE_URL;
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
};

export default Routing;
