import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import ExpenseTracker from './Components/ExpenseTracker';
import Login from './Components/Login';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExpenseTracker />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
