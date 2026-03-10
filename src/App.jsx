// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Watchlist from './pages/Watchlist'
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/watchlist" element={<Watchlist />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App

