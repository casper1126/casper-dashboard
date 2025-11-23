import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DayDetail from './pages/DayDetail';
import MuseumDetail from './pages/MuseumDetail';
import AdminDashboard from './pages/AdminDashboard';

import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:id" element={<DayDetail />} />
          <Route path="/museum/:id" element={<MuseumDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
