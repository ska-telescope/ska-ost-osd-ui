import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default Routing;
