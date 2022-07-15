//import logo from './logo.svg';
//import './App.css';
import React from 'react';
import Home from './pages/Home';
import User from './pages/User';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:idParam" element={<User />} />
      </Routes>
    </Router>
  )
}

export default App;
