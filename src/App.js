import React from 'react';
import Home from './Pages/Home/Home';
import User from './Pages/User/User';
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
